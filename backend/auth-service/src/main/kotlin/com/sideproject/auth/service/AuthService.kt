package com.sideproject.auth.service

import com.sideproject.auth.entity.User
import com.sideproject.auth.jwt.JwtProvider
import com.sideproject.auth.repository.UserRepository
import com.sideproject.common.dto.LoginResponse
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class AuthService(
    private val strategies: List<OAuthStrategy>,
    private val userRepository: UserRepository,
    private val jwtProvider: JwtProvider
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    fun processSocialLogin(providerName: String, code: String): LoginResponse {
        // 1. 적절한 전략 찾기
        val strategy = strategies.find { it.supports(providerName) }
            ?: throw IllegalArgumentException("지원하지 않는 로그인 방식입니다: $providerName")

        // 2. 소셜 서비스로부터 유저 정보 획득 (Google 혹은 Kakao)
        val socialUser = strategy.login(code)

        // 3. email로 유저 신규/로그인 수행 확인
        val existingUser = userRepository.findByEmail(socialUser.email)
        val expiresAt = LocalDateTime.now().plusSeconds(socialUser.expiresIn)

        val user = if (existingUser != null) {
            log.info("기존 유저 로그인: ${socialUser.email}")
            existingUser.apply {
                // 기존 구글 유저 업데이트 로직을 확장하여 공통 업데이트
                updateSocialInfo(socialUser, expiresAt)
            }
        } else {
            log.info("신규 유저 생성: ${socialUser.email}")
            userRepository.save(
                User(
                    email = socialUser.email,
                    name = socialUser.name,
                    picture = socialUser.picture,
                    provider = socialUser.provider,
                    providerId = socialUser.providerId,
                    // 구글일 때만 값을 넣고, 나머지는 null 전달
                    googleAccessToken = if (socialUser.provider == AuthProvider.GOOGLE) socialUser.accessToken else null,
                    googleRefreshToken = if (socialUser.provider == AuthProvider.GOOGLE) socialUser.refreshToken else null,
                    googleTokenExpiresAt = if (socialUser.provider == AuthProvider.GOOGLE) expiresAt else null
                )
            )
        }

        // 4. 자체 JWT 발급
        val accessToken = jwtProvider.createAccessToken(user)
        return LoginResponse(
            accessToken = accessToken,
            userId = user.id!!,
            isNewUser = (existingUser == null)
        )
    }
}
