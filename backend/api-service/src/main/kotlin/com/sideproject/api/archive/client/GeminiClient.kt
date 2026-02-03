package com.sideproject.api.archive.client

import com.sideproject.api.archive.dto.GeminiRequest
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(name = "geminiClient", url = "https://generativelanguage.googleapis.com")
interface GeminiClient {

    @PostMapping("/v1/models/gemini-2.5-flash:generateContent")
    fun generateContent(
        @RequestParam("key") apiKey: String,
        @RequestBody request: GeminiRequest
    ): Map<String, Any>
}