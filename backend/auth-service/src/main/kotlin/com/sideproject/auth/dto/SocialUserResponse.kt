package com.sideproject.auth.dto

import com.sideproject.auth.service.AuthProvider

data class SocialUserResponse(
    val email: String,           // 유저 식별 및 연락처 (가장 중요)
    val name: String,            // 실명 또는 닉네임
    val picture: String?,        // 프로필 이미지 URL
    val provider: AuthProvider,  // GOOGLE, KAKAO 등 (Enum)
    val providerId: String,      // 소셜 서비스에서 부여한 고유 ID (PK 대용)
    val accessToken: String,     // 소셜 API 호출용 액세스 토큰
    val refreshToken: String?,   // (선택) 토큰 갱신용
    val expiresIn: Long          // 토큰 만료 시간 (초 단위)
)