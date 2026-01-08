package com.sideproject.common.auth

data class AuthVerifyResponse(
    val userId: Long,
    val roles: List<String>
)
