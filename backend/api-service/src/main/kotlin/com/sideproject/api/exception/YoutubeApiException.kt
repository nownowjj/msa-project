package com.sideproject.api.exception

class YoutubeApiException(
    val status: Int,
    val errorReason: String?,
    override val message: String,
    val details: String?
) : RuntimeException(message)