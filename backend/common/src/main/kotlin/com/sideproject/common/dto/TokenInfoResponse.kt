package com.sideproject.common.dto

import java.time.LocalDateTime

data class TokenInfoResponse(
    val accessToken: String,
    val expiresAt: LocalDateTime
)