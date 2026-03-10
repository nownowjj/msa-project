package com.sideproject.api.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.sideproject.api.exception.YoutubeApiException
import com.sideproject.api.exception.YoutubeErrorResponse
import feign.Response
import feign.codec.ErrorDecoder

class YoutubeErrorDecoder(private val objectMapper: ObjectMapper) : ErrorDecoder {
    override fun decode(methodKey: String, response: Response): Exception {
        val responseBody = response.body()?.asInputStream()?.bufferedReader()?.use { it.readText() }

        // YouTube API 에러 구조 파싱 시도
        val youtubeError = runCatching {
            objectMapper.readValue(responseBody, YoutubeErrorResponse::class.java)
        }.getOrNull()

        val status = response.status()
        val reason = youtubeError?.error?.errors?.firstOrNull()?.reason
        val message = youtubeError?.error?.message ?: "YouTube API 호출 오류"

        // 특정 도메인 예외로 던짐
        return YoutubeApiException(status, reason, message, responseBody)
    }
}

