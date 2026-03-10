package com.sideproject.api.youtube.dto

data class YoutubePlaylistItemDto(
    val id: String,
    val snippet: PlaylistItemSnippet?, // snippet 자체가 없을 수도 있음
    val contentDetails: PlaylistItemContentDetails?
)

data class PlaylistItemSnippet(
    val publishedAt: String?,
    val channelId: String?,
    val title: String?,
    val description: String?,
    val thumbnails: Thumbnails?,
    val playlistId: String?,
    val position: Int?,
    val resourceId: ResourceId?
)

data class ResourceId(
    val kind: String?,
    val videoId: String?
)

data class PlaylistItemContentDetails(
    val videoId: String?,
    val videoPublishedAt: String? // 삭제된 영상의 경우 이게 누락될 가능성 높음
)