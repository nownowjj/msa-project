package com.sideproject.api.youtube.dto

// 모든 유튜브 리스트 응답의 공통 껍데기
data class YoutubeBaseResponse<T>(
    val kind: String,
    val etag: String,
    val nextPageToken: String? = null,
    val pageInfo: PageInfo,
    val items: List<T>
)

data class PageInfo(
    val totalResults: Int,
    val resultsPerPage: Int
)

// 썸네일 정보는 모든 리소스에서 동일하게 사용
data class Thumbnails(
    val default: ThumbnailDetails,
    val medium: ThumbnailDetails?,
    val high: ThumbnailDetails?,
    val standard: ThumbnailDetails?,
    val maxres: ThumbnailDetails?
)

data class ThumbnailDetails(
    val url: String,
    val width: Int,
    val height: Int
)

