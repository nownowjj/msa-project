package com.sideproject.auth.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class KakaoTokenResponse(
    @JsonProperty("access_token")
    val accessToken: String,

    @JsonProperty("token_type")
    val tokenType: String,

    @JsonProperty("refresh_token")
    val refreshToken: String?,

    @JsonProperty("expires_in")
    val expiresIn: Long, // 액세스 토큰 만료 시간 (초)

    @JsonProperty("refresh_token_expires_in")
    val refreshTokenExpiresIn: Long?,

    val scope: String?
)