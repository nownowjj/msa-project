package com.sideproject.api.youtube.dto

import jakarta.validation.constraints.NotBlank

data class YoutubeSearchRequest(
    @field:NotBlank(message = "검색어(q)는 필수입니다")
    val query: String,                       // 필수

    val maxResults: Int = 10,
    val order: String = "relevance",
    val regionCode: String = "KR",
    val relevanceLanguage: String = "ko",
    val safeSearch: String = "moderate"
)
