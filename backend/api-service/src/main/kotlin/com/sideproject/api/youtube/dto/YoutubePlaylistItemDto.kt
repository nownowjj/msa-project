package com.sideproject.api.youtube.dto

data class YoutubePlaylistItemDto(
    val id: String,
    val snippet: PlaylistItemSnippet,
    val contentDetails: PlaylistItemContentDetails
)

data class PlaylistItemSnippet(
    val publishedAt: String,
    val channelId: String,
    val title: String,
    val description: String,
    val thumbnails: Thumbnails,
    val playlistId: String,
    val position: Int,
    val resourceId: ResourceId // 비디오 ID가 들어있는 곳
)

data class ResourceId(
    val kind: String,
    val videoId: String
)

data class PlaylistItemContentDetails(
    val videoId: String,
    val videoPublishedAt: String
)