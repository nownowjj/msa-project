package com.sideproject.api.youtube.service

import com.sideproject.api.youtube.dto.YoutubeSearchRequest
import com.sideproject.api.youtube.dto.YoutubeSearchResponse
import com.sideproject.api.youtube.dto.YoutubeVideoDto
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

// https://developers.google.com/youtube/v3/docs/search/list?hl=ko&_gl=1*1gzys7u*_up*MQ..*_ga*OTE1OTQzMTI4LjE3Njc5MjIzNDc.*_ga_SM8HXJ53K2*czE3Njc5MjIzNDckbzEkZzAkdDE3Njc5MjIzNDckajYwJGwwJGgw

@Service
class YoutubeService (
    private val youtubeWebClient: WebClient,
    @Value("\${youtube.api-key}") private val apiKey: String
){
    private val log = LoggerFactory.getLogger(javaClass)

    fun search(youtubeSearchRequest: YoutubeSearchRequest ): List<YoutubeVideoDto> {
        log.info("hi");

        val response = youtubeWebClient.get()
            .uri {
                it.path("/search")
                    .queryParam("part", "snippet")
                    .queryParam("type", "video")
                    .queryParam("maxResults", 10)
                    .queryParam("q", youtubeSearchRequest.query)
                    .queryParam("key", apiKey)
                    .build()
            }
            .retrieve()
            .onStatus({ it.isError }) { response ->
                response.bodyToMono(String::class.java)
                    .map { RuntimeException("YouTube API error: ${response.statusCode()} / $it") }
            }
            .bodyToMono(YoutubeSearchResponse::class.java)
            .doOnError { e ->
                log.error("🔥 YouTube API 호출 중 예외 발생", e)
            }
            .block()

        return response.items
            .filter { it.id.videoId != null }
            .map {
                YoutubeVideoDto(
                    videoId = it.id.videoId!!,
                    title = it.snippet.title,
                    channel = it.snippet.channelTitle,
                    thumbnail = it.snippet.thumbnails.medium?.url
                        ?: it.snippet.thumbnails.default?.url
                        ?: "",
                    url = "https://www.youtube.com/watch?v=${it.id.videoId}",
                    publishedAt = it.snippet.publishedAt
                )
            }
    }
}