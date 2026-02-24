package com.sideproject.common.dto

data class SocialLoginRequest(
    val provider: String, // "google", "kakao", "naver"
    val code: String
)