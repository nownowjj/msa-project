package com.sideproject.api.youtube.dto

data class YoutubeSearchResponse(
    val kind: String,
    val etag: String,
    val nextPageToken: String?,
    val prevPageToken: String?,
    val regionCode: String?,
    val pageInfo: PageInfo,
    val items: List<YoutubeSearchItem>
) {
    data class PageInfo(
        val totalResults: Int,
        val resultsPerPage: Int
    )

    data class YoutubeSearchItem(
        val kind: String,
        val etag: String,
        val id: YoutubeSearchId,
        val snippet: YoutubeSnippet
    )

    data class YoutubeSearchId(
        val kind: String,
        val videoId: String?,
        val channelId: String?,
        val playlistId: String?
    )

    data class YoutubeSnippet(
        val publishedAt: String,
        val channelId: String,
        val title: String,
        val description: String,
        val thumbnails: YoutubeThumbnails,
        val channelTitle: String,
        val liveBroadcastContent: String
    )

    data class YoutubeThumbnails(
        val default: YoutubeThumbnail?,
        val medium: YoutubeThumbnail?,
        val high: YoutubeThumbnail?,
        val standard: YoutubeThumbnail?,
        val maxres: YoutubeThumbnail?
    )

    data class YoutubeThumbnail(
        val url: String,
        val width: Int?,
        val height: Int?
    )
}
