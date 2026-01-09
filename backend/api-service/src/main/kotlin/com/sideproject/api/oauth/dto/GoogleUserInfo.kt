package com.sideproject.api.oauth.dto

data class GoogleUserInfo(
    val id: String,
    val email: String,
    val name: String,
    val picture: String
)
