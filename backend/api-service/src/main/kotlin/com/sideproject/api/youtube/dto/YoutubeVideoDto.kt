package com.sideproject.api.youtube.dto

import javax.management.monitor.StringMonitor

data class YoutubeVideoDto(
    val videoId: String,
    val title: String,
    val channel: String,
    val thumbnail: String,
    var publishedAt : String,
    val url: String = "https://www.youtube.com/watch?v=$videoId"
)