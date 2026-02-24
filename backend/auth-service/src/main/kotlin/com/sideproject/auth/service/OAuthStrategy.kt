package com.sideproject.auth.service

// 소셜 공급자 구분
enum class AuthProvider { GOOGLE, KAKAO }

// 소셜 서비스에서 가져온 공통 사용자 정보
data class SocialUserInfo(
    val email: String,
    val name: String,
    val picture: String,
    val provider: AuthProvider,
    val providerId: String,
    val accessToken: String,
    val refreshToken: String?,
    val expiresIn: Long
)

interface OAuthStrategy {
    fun supports(provider: String): Boolean
    fun login(code: String): SocialUserInfo
}