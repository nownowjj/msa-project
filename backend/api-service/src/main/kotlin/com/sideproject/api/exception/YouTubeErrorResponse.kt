package com.sideproject.api.exception

// YouTubeErrorResponse.kt
data class YoutubeErrorResponse(
    val error: YoutubeErrorDetail
)

data class YoutubeErrorDetail(
    val code: Int,
    val message: String,
    val errors: List<YoutubeErrorItem>
)

data class YoutubeErrorItem(
    val message: String,
    val domain: String,
    val reason: String // 할당량 초과(quotaExceeded), 인증 오류(authError) 등
)