package com.sideproject.api.archive.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.sideproject.api.archive.client.GeminiClient
import com.sideproject.api.archive.dto.AiAnalysisResponse
import com.sideproject.api.archive.dto.Content
import com.sideproject.api.archive.dto.GeminiRequest
import com.sideproject.api.archive.dto.Part
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class GeminiService(
    @Value("\${gemini.api.key}") private val apiKey: String,
    private val geminiClient: GeminiClient,
    private val objectMapper: ObjectMapper
) {
    fun analyzeContent(textContent: String): AiAnalysisResponse {
        val prompt = """
            Analyze the following text and provide a response strictly in JSON format.
            Do not include markdown code blocks.
            
            Structure:
            {
              "summary": "3-line summary in Korean",
              "keywords": ["kw1", "kw2", "kw3"],
              "category": "IT/Economy/Life/Etc"
            }

            Text: ${textContent.take(5000)}
        """.trimIndent()

        val request = GeminiRequest(listOf(Content(listOf(Part(prompt)))))

        // 핵심: 모델명 앞에 'models/'를 붙여서 경로를 완성합니다.
//        val response = geminiClient.generateContent("models/gemini-1.5-flash", apiKey, request)
        val response = geminiClient.generateContent(apiKey, request)

        // ... (응답 파싱 로직은 이전과 동일) ...
        val candidates = response["candidates"] as List<*>
        val firstCandidate = candidates[0] as Map<*, *>
        val contentMap = firstCandidate["content"] as Map<*, *>
        val parts = contentMap["parts"] as List<*>
        val firstPart = parts[0] as Map<*, *>
        val rawJson = firstPart["text"] as String

        val cleanJson = rawJson.replace("```json", "").replace("```", "").trim()
        return objectMapper.readValue(cleanJson, AiAnalysisResponse::class.java)
    }
}