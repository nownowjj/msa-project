package com.sideproject.api.archive.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.sideproject.api.archive.client.GeminiClient
import com.sideproject.api.archive.dto.GeminiAiResponse
import com.sideproject.api.archive.dto.GeminiRequest
import com.sideproject.api.archive.dto.TempMetadataCache
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.time.Duration

@Service
class GeminiService(
    @Value("\${gemini.api.key}") private val apiKey: String,
    private val geminiClient: GeminiClient,
    private val objectMapper: ObjectMapper,
    private val scraperService: ScraperService,
    private val redisTemplate: RedisTemplate<String,Any>
) {

    /**
     * [Public] AI 분석 오케스트레이터
     * 캐시 확인 -> 복구(필요시) -> AI 요청(Private 호출) -> 결과 반환
     */
    fun analyzeContent(url: String, userId: Long): GeminiAiResponse {
        val userSessionKey = "temp:metadata:$userId"

        // 1. 캐시 확인 및 복구 (Self-healing)
        val cachedData = (redisTemplate.opsForValue().get(userSessionKey) as? TempMetadataCache)
            ?: recoverMetadata(url, userId)

        val content = cachedData.content
            ?: throw IllegalArgumentException("분석할 본문 내용이 없습니다.")

        // 2. Private AI 요청 메서드 호출
        return try {
            val aiResult = callGeminiApi(content)

            // 3. 최종 등록을 위해 캐시에 AI 결과 업데이트 (선택 사항)
//            updateCacheWithAiResult(userSessionKey, cachedData, aiResult)

            GeminiAiResponse(aiResult.summary, aiResult.keywords)
        } catch (e: Exception) {
            // 예외 발생 시 로그 남기고 옵셔널 반환 (Graceful Degradation)
            println("AI 요약 중 오류 발생: ${e.message}")
            GeminiAiResponse("AI 요약에 실패 하였습니다.", null)
        }
    }


    /**
     * [Private] FeignClient를 통해 Gemini API 호출 및 결과 파싱
     */
    private fun callGeminiApi(textContent: String): GeminiAiResponse {
        val prompt = """
            Analyze the following text and provide a response strictly in JSON format.
            Do not include markdown code blocks.
            
            Structure:
            {
              "summary": "3-line summary in Korean",
              "keywords": ["kw1", "kw2", "kw3"]
            }

            Text: ${textContent.take(5000)}
        """.trimIndent()

        // 1. FeignClient 호출
        val request = GeminiRequest.from(prompt)
        val response = geminiClient.generateContent(apiKey, request)

        // 2. Gemini의 복잡한 응답 계층에서 "text" 부분만 추출
        // 구조: candidates[0] -> content -> parts[0] -> text
        val candidates = response["candidates"] as? List<Map<String, Any>>
        val firstCandidate = candidates?.get(0)
        val contentMap = firstCandidate?.get("content") as? Map<String, Any>
        val parts = contentMap?.get("parts") as? List<Map<String, Any>>
        val rawJsonText = parts?.get(0)?.get("text") as? String
            ?: throw RuntimeException("AI 응답에서 텍스트를 추출할 수 없습니다.")

        // 3. 추출된 JSON 문자열을 GeminiAiResponse 객체로 역직렬화
        return try {
            val cleanText = cleanJsonText(rawJsonText)
            objectMapper.readValue(cleanText, GeminiAiResponse::class.java)
        } catch (e: Exception) {
            throw RuntimeException("AI 응답 형식이 올바르지 않습니다: ${e.message}")
        }
    }
    /**
     * [Private] 캐시 유실 시 복구 로직
     */
    private fun recoverMetadata(url: String, userId: Long): TempMetadataCache {
        val freshData = scraperService.scraper(url)
        redisTemplate.opsForValue().set("temp:metadata:$userId", freshData, Duration.ofMinutes(15))
        return freshData
    }

    private fun cleanJsonText(rawText: String): String {
        return rawText
            .replace("```json", "")
            .replace("```", "")
            .trim()
    }
}