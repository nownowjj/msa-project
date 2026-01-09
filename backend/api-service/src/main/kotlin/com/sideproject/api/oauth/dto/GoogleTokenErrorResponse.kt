package com.sideproject.api.oauth.dto

data class GoogleTokenErrorResponse(
    val error: String?,
    val error_description: String?
)
