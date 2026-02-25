package com.sideproject.auth.service

import com.sideproject.auth.dto.SocialUserResponse
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

        val socialUserInfo = strategy.login(code)

        val result = findOrCreateUser(socialUserInfo)

        val accessToken = jwtProvider.createAccessToken(result.user)
        return LoginResponse(
            accessToken = accessToken,
            userId = result.user.id!!,
            isNewUser = result.isNewUser,
            message = result.message // 컨트롤러를 통해 프론트에 전달됨
        )
    }

    private fun findOrCreateUser(socialUserInfo: SocialUserInfo): UserAuthResult {
        val expiresAt = LocalDateTime.now().plusSeconds(socialUserInfo.expiresIn)
        val existingUser = userRepository.findByEmail(socialUserInfo.email)

        if (existingUser != null) {
            // ✅ 1. 이메일은 같지만 가입된 소셜 플랫폼(Provider)이 다른 경우
            if (existingUser.provider != socialUserInfo.provider) {
                log.info("이메일 중복 - 기존 플랫폼으로 로그인: ${existingUser.provider}")

                // 기존 유저 정보 업데이트 (선택 사항: 타 플랫폼 토큰도 업데이트할지 결정)
                existingUser.updateSocialInfo(socialUserInfo, expiresAt)

                return UserAuthResult(
                    user = existingUser,
                    isNewUser = false,
                    message = "기존에 가입하신 ${existingUser.provider} 계정과 이메일이 일치하여 ${existingUser.provider} 계정으로 로그인을 수행합니다."
                )
            }

            // ✅ 2. 기존 유저이고 플랫폼도 일치하는 경우
            log.info("기존 유저 로그인: ${socialUserInfo.email}")
            existingUser.updateSocialInfo(socialUserInfo, expiresAt)
            return UserAuthResult(existingUser, false)
        }

        // ✅ 3. 신규 유저 생성
        log.info("신규 유저 생성: ${socialUserInfo.email}")
        val newUser = userRepository.save(User.createSocialUser(socialUserInfo, expiresAt))
        return UserAuthResult(newUser, true)
    }
}

// 결과 전달을 위한 임시 DTO
data class UserAuthResult(
    val user: User,
    val isNewUser: Boolean,
    val message: String? = null
)
