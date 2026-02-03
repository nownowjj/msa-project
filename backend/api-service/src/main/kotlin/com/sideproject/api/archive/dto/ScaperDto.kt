package com.sideproject.api.archive.dto

// Redis 저장용 (모든 데이터 포함)
data class TempMetadataCache(
    val url: String,
    val title: String?,
    val thumbnailUrl: String?,
    val content: String?
)

// 클라이언트 응답용 (본문 제외)
data class UrlMetadataResponse(
    val title: String?,
    val thumbnailUrl: String?
)