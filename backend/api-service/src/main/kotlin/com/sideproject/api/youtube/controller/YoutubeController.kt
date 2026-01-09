package com.sideproject.api.youtube.controller

import com.sideproject.api.youtube.dto.YoutubeSearchRequest
import com.sideproject.api.youtube.dto.YoutubeVideoDto
import com.sideproject.api.youtube.service.YoutubeService
import com.sideproject.common.security.PermitAll
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * 공식 엔드 포인트 : https://www.googleapis.com/youtube/v3/search
 * 주요 Parameter {
 *      part : 어떤 정보를 받을지(snippet이 기본)
 *      q    : 검색어(키워드)
 *      type : 검색 타입(동영상 : vidoe , 채널 : channel , 재생목록 : playlist)
 *      maxResults : 한번에 받을 결과 수(최대 50)
 *      key     : 내 API 키
 * }
 */

@RestController
@RequestMapping("/api/youtube")
class YoutubeController(
    private val youtubeService: YoutubeService
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @PermitAll
    @GetMapping("/search")
    fun search(@Valid youtubeSearchRequest: YoutubeSearchRequest ): ResponseEntity<List<YoutubeVideoDto>> {
        log.info("youtubeSearchRequest : {} ",youtubeSearchRequest)
        return ResponseEntity.ok(youtubeService.search(youtubeSearchRequest))
    }
}