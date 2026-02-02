package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.UrlMetadata
import org.jsoup.Jsoup
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service

@Service
class ScraperService (
    private val redisTemplate: RedisTemplate<String, Any>
){
//    fun extract(url: String): UrlMetadata {
//        val doc = Jsoup.connect(url)
//            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
//            .timeout(5000)
//            .get()
//
//        // 1. 메타데이터 추출
//        val title = doc.select("meta[property=og:title]").attr("content").ifEmpty { doc.title() }
//        val thumbnail = doc.select("meta[property=og:image]").attr("content")
//
//        // 2. 데이터 정제: 분석에 방해되는 태그 제거
//        val cleanDoc = doc.clone() // 원본 보존
//        cleanDoc.select("script, style, header, footer, nav, aside, form, iframe, .ads, #footer").remove()
//
//        // 3. 본문 텍스트 추출 (최대 5000자 제한 - AI 토큰 절약)
//        val rawContent = cleanDoc.body().text()
//        val content = if (rawContent.length > 5000) rawContent.substring(0, 5000) else rawContent
//
//        return UrlMetadata(title, thumbnail, content)
//    }

    fun extract(url: String, userId: Long): UrlMetadataResponse {
        val doc = Jsoup.connect(url)
            .userAgent("Mozilla/5.0 ...")
            .timeout(5000)
            .get()

        val title = doc.select("meta[property=og:title]").attr("content").ifEmpty { doc.title() }
        val thumbnail = doc.select("meta[property=og:image]").attr("content")

        // 본문 정제 및 추출
        val cleanDoc = doc.clone()
        cleanDoc.select("script, style, header, footer, nav, aside, form, iframe").remove()
        val rawContent = cleanDoc.body().text()
        val content = if (rawContent.length > 5000) rawContent.substring(0, 5000) else rawContent

        // Redis에 사용자별로 저장 (Key: temp:metadata:{userId}, TTL: 10분)
        val cacheData = TempMetadataCache(url, title, thumbnail, content)
        redisTemplate.opsForValue().set(
            "temp:metadata:$userId",
            cacheData,
            Duration.ofMinutes(10)
        )

        return UrlMetadataResponse(title, thumbnail)
    }
}