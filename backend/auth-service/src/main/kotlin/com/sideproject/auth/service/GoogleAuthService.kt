package com.sideproject.auth.service

import com.google.api.client.auth.oauth2.TokenRequest
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest
import com.google.api.client.http.GenericUrl
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.sideproject.auth.component.GoogleTokenVerifier
import com.sideproject.auth.entity.User
import com.sideproject.auth.jwt.JwtProvider
import com.sideproject.auth.repository.UserRepository
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.dto.TokenInfoResponse
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class GoogleAuthService(
    private val googleTokenVerifier: GoogleTokenVerifier,
    private val userRepository: UserRepository,
    private val jwtProvider: JwtProvider,

    @Value("\${google.client-id}") private val clientId: String,
    @Value("\${google.client-secret}") private val clientSecret: String,
//    @Value("\${google.redirect-uri}") private val redirectUri: String // 프론트엔드와 일치해야 함
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getOrRefreshAccessToken(email: String): TokenInfoResponse {
        val user = userRepository.findByEmail(email) ?: throw Exception("User not found")

        // 만료 5분 전인지 체크 (Proactive Refresh)
        val isExpired = user.googleTokenExpiresAt?.minusMinutes(5)?.isBefore(LocalDateTime.now()) ?: true

        return if (isExpired) {
            refreshGoogleToken(user)
        } else {
            TokenInfoResponse(user.googleAccessToken!!, user.googleTokenExpiresAt!!)
        }
    }

    // DB refresh_token으로 youtube access_token 발급
    private fun refreshGoogleToken(user: User): TokenInfoResponse {
        val user = userRepository.findByEmail(user.email)
            ?: throw RuntimeException("유저를 찾을 수 없습니다.")

        val refreshToken = user.googleRefreshToken
            ?: throw RuntimeException("Refresh Token이 없습니다. 재로그인이 필요합니다.")

        // 구글 서버에 새 토큰 요청
        val response = TokenRequest(
            NetHttpTransport(),
            GsonFactory.getDefaultInstance(),
            GenericUrl("https://oauth2.googleapis.com/token"),
            "refresh_token"
        ).set("client_id", clientId)
            .set("client_secret", clientSecret)
            .set("refresh_token", refreshToken)
            .set("grant_type", "refresh_token")
            .execute()

        val newAccessToken = response.accessToken

        // 2. 새 정보 업데이트
        user.googleAccessToken = newAccessToken
        user.googleTokenExpiresAt = LocalDateTime.now().plusSeconds(3600)
        userRepository.save(user)

        return TokenInfoResponse(user.googleAccessToken!!, user.googleTokenExpiresAt!!)
    }
}