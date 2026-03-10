package com.sideproject.api.youtube.service

import com.sideproject.api.youtube.client.YoutubeClient
import com.sideproject.api.youtube.dto.YoutubeCommentThreadDto
import com.sideproject.api.youtube.dto.YoutubePlaylistDto
import com.sideproject.api.youtube.dto.YoutubePlaylistItemDto
import com.sideproject.api.youtube.dto.YoutubeVideoDto
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service


@Service
class YoutubeService (
    private val youtubeClient: YoutubeClient,
    @Value("\${youtube.api-key}") private val apiKey: String
){
    private val log = LoggerFactory.getLogger(javaClass)


    fun getAllPlayLists(): List<YoutubePlaylistDto> {
        val allPlayLists = mutableListOf<YoutubePlaylistDto>()
        var nextPageToken: String? = null

        do{
            val response = youtubeClient.getAllPlayLists(pageToken = nextPageToken)
            allPlayLists.addAll(response.items)
            nextPageToken = response.nextPageToken
        }while (nextPageToken != null)

        return allPlayLists
    }

    fun getPlayListItem(playlistId: String): List<YoutubePlaylistItemDto> {
        val response = youtubeClient.getMyPlaylistItems(playlistId = playlistId)

        // 비즈니스 로직: 유효한 영상만 필터링하여 반환
        return response.items.filter { item ->
            val snippet = item.snippet
            // 1. 제목이 "Private video"가 아니고
            // 2. 썸네일 정보가 최소 하나는 존재하는 영상만 노출
            snippet?.title != "Private video" &&
                    snippet?.thumbnails?.defaultDetail?.url != null
        }
    }

    fun getMyVideo(id: String): List<YoutubeVideoDto> =
        youtubeClient.getMyVideo(id = id).items


    fun getMyVideoComments(videoId: String): List<YoutubeCommentThreadDto> =
        youtubeClient.getMyVideoComments(videoId = videoId).items

}