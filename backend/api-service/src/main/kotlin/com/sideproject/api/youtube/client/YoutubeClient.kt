package com.sideproject.api.youtube.client

import com.sideproject.api.config.FeignInterceptorConfig
import com.sideproject.api.youtube.dto.*
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(
    name = "youtube-client",
    url = "https://www.googleapis.com/youtube/v3",
    configuration = [FeignInterceptorConfig::class] // 여기에만 인터셉터 적용
)
interface YoutubeClient {

    // 재생 목록
    @GetMapping("/playlists")
    fun getMyPlaylists(
        @RequestParam("part") part: String = "snippet,contentDetails",
        @RequestParam("mine") mine: Boolean = true,
        @RequestParam("maxResults") maxResults: Int = 50
    ): YoutubeBaseResponse<YoutubePlaylistDto>

    // 재생 목록 상세 아이템
    @GetMapping("/playlistItems")
    fun getMyPlaylistItems(
        @RequestParam("part") part: String = "snippet,contentDetails",
        @RequestParam("playlistId") playlistId: String ,
        @RequestParam("maxResults") maxResults: Int = 50
    ): YoutubeBaseResponse<YoutubePlaylistItemDto>

    // 영상 정보
    @GetMapping("/videos")
    fun getMyVideo(
        @RequestParam("part") part: String = "statistics,snippet",
        @RequestParam("id") id: String
    ): YoutubeBaseResponse<YoutubeVideoDto>

    // 영상 댓글
    @GetMapping("/commentThreads")
    fun getMyVideoComments(
//        @RequestHeader("Authorization") bearerToken: String,
        @RequestParam("part") part: String = "snippet",
        @RequestParam("videoId") videoId: String,
        @RequestParam("maxResults") maxResults: Int = 20
    ): YoutubeBaseResponse<YoutubeCommentThreadDto>
}