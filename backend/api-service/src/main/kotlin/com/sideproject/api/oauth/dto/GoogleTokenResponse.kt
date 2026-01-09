package com.sideproject.api.oauth.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class GoogleTokenResponse(

    @JsonProperty("access_token")
    val accessToken: String,

    @JsonProperty("expires_in")
    val expiresIn: Long,

    @JsonProperty("refresh_token")
    val refreshToken: String? = null,

    @JsonProperty("scope")
    val scope: String,

    @JsonProperty("token_type")
    val tokenType: String,

    @JsonProperty("refresh_token_expires_in")
    val refreshTokenExpiresIn: Long? = null
)

