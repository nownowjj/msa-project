package com.sideproject.api.youtube.dto

data class YoutubePlaylistDto(
    val id: String,
    val snippet: PlaylistSnippet,
    val contentDetails: PlaylistContentDetails
)

data class PlaylistSnippet(
    val publishedAt: String,
    val channelId: String,
    val title: String,
    val description: String,
    val thumbnails: Thumbnails,
    val channelTitle: String
)

data class PlaylistContentDetails(
    val itemCount: Int
)