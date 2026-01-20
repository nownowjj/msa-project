package com.sideproject.auth.service

import com.google.api.client.auth.oauth2.TokenRequest
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest
import com.google.api.client.http.GenericUrl
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.sideproject.auth.component.GoogleTokenVerifier
import com.sideproject.auth.dto.LoginResponse
import com.sideproject.auth.entity.AuthProvider
import com.sideproject.auth.entity.User
import com.sideproject.auth.jwt.JwtProvider
import com.sideproject.auth.repository.UserRepository
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
    @Value("\${google.redirect-uri}") private val redirectUri: String // 프론트엔드와 일치해야 함
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    fun googleLoginWithCode(code: String): LoginResponse {
        // 1. Google로부터 토큰 꾸러미 획득
        val tokens = this.exchangeCodeForTokens(code)
        log.info("Google로부터 토큰 꾸러미 tokens : {}" , tokens)

        // 2. idToken 검증 및 사용자 정보 추출 (기존에 구현하신 logic 활용)
        val googleUser = googleTokenVerifier.verify(tokens.idToken)
        log.info("googleUser : {}" , googleUser)

        // 3. DB 저장 및 토큰 업데이트 로직
        val existingUser = userRepository.findByEmail(googleUser.email)

        // 만료 시간 계산 (현재 시간 + 구글에서 준 expires_in 초)
        // tokens.expiresInSeconds가 보통 Long 타입으로 제공됩니다.
        val expiresAt = LocalDateTime.now().plusSeconds(3600)

        val user = if (existingUser != null) {
            log.info("유저 이미 존재해!!")
            // 2. 기존 유저: 필드만 수정 (트랜잭션 종료 시 Dirty Checking으로 자동 업데이트)
            existingUser.apply {
                updateFromGoogle(
                    name = googleUser.name,
                    picture = googleUser.picture,
                    accessToken = tokens.accessToken,
                    refreshToken = tokens.refreshToken,
                    expiresAt = expiresAt

                )
            }
        } else {
            log.info("신규 유저 생성!!")
            // 3. 신규 유저: 새로 생성 후 저장
            userRepository.save(
                User(
                    email = googleUser.email,
                    name = googleUser.name,
                    picture = googleUser.picture,
                    provider = AuthProvider.GOOGLE,
                    providerId = googleUser.sub,
                    googleAccessToken = tokens.accessToken,
                    googleRefreshToken = tokens.refreshToken,
                    googleTokenExpiresAt = expiresAt
                )
            )
        }

        // 4. JWT 발급
        val accessToken = jwtProvider.createAccessToken(user.email)

        return LoginResponse(accessToken = accessToken)
    }


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

    private fun exchangeCodeForTokens(code: String): GoogleTokens {
        val tokenResponse = GoogleAuthorizationCodeTokenRequest(
            NetHttpTransport(),
            GsonFactory.getDefaultInstance(),
            "https://oauth2.googleapis.com/token",
            clientId,
            clientSecret,
            code,
            "postmessage" //
//            redirectUri // 리액트에서 설정한 주소와 동일해야 함
        ).execute()

        return GoogleTokens(
            idToken = tokenResponse.idToken,
            accessToken = tokenResponse.accessToken,
            refreshToken = tokenResponse.refreshToken // 여기서 받은 refresh_token을 DB에 저장해야 함
        )
    }
}

data class GoogleTokens(
    val idToken: String,
    val accessToken: String,
    val refreshToken: String?
)