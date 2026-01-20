package com.sideproject.api.youtube.dto

data class YoutubeVideoDto(
    val id: String,
    val snippet: VideoSnippet,
    val statistics: VideoStatistics
)

data class VideoSnippet(
    val publishedAt: String,
    val channelId: String,
    val title: String,
    val description: String,
    val thumbnails: Thumbnails,
    val channelTitle: String,
    val categoryId: String
)

data class VideoStatistics(
    val viewCount: String,
    val likeCount: String,
    val commentCount: String
)