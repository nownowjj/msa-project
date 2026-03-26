package com.sideproject.common.dto

data class LoginResponse(
    val accessToken: String,
    val userId: Long,       // 유저 식별자 추가
    val isNewUser: Boolean,  // 신규 가입 여부 추가
    val message: String? = null, // 사용자에게 보여줄 안내 메시지
    val profile: String?, // 프로필 이미지
    val name: String
)