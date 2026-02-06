package com.sideproject.api.archive.controller

import com.sideproject.api.archive.dto.GeminiAiResponse
import com.sideproject.api.archive.service.GeminiService
import com.sideproject.auth.dto.AuthUser
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/gemini")
class GeminiController(
    private val geminiService: GeminiService
) {

    /** 입력한 url AI 요약 및 키워드 반환  */
    @GetMapping
    fun analyzeUrl(
        @RequestParam url: String,
        @AuthenticationPrincipal user: AuthUser // 사용자 정보 주입
    ): GeminiAiResponse {
        return geminiService.analyzeContent(url, user.id)
    }
}