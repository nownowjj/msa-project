package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.TempMetadataCache
import com.sideproject.api.archive.dto.UrlMetadataResponse
import org.jsoup.Jsoup
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.time.Duration

@Service
class ScraperService(
    private val redisTemplate: RedisTemplate<String, Any>
){
    fun getAndCacheMetadata(url: String, userId: Long): UrlMetadataResponse {
        val sharedCacheKey = "metadata:shared:${url.hashCode()}"
        val userSessionKey = "temp:metadata:$userId"

        // [Step 1] URL 기반 공유 캐시 확인
        val sharedCache = redisTemplate.opsForValue().get(sharedCacheKey) as? TempMetadataCache

        val targetData = if (sharedCache != null) {
            // 공유 캐시가 있으면 그대로 사용
            sharedCache
        } else {
            // [Step 2] 공유 캐시 없으면 크롤링 수행
            val scrapedData = scraper(url)

            // [Step 3] 크롤링 결과 공유 캐시에 저장 (다른 사용자도 쓸 수 있게 1시간 정도 )
            redisTemplate.opsForValue().set(sharedCacheKey, scrapedData, Duration.ofHours(1))
            scrapedData
        }

        // [Step 4] 사용자별 작업 세션(UserId)에 복사/저장 (최종 등록 및 AI 요약을 위한 스테이징)
        // 사용자가 URL을 바꾸면 이 키값에 덮어씌워지므로 "기존 캐시 삭제" 효과 발생.
        redisTemplate.opsForValue().set(userSessionKey, targetData, Duration.ofMinutes(15))

        // [Step 5] 클라이언트에 필요한 최소 정보만 반환
        return UrlMetadataResponse(
            title = targetData.title,
            thumbnailUrl = targetData.thumbnailUrl
        )
    }

    /** Jsoup 크롤링 서비스 */
    fun scraper(url: String): TempMetadataCache {
        val doc = Jsoup.connect(url)
            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .timeout(5000)
            .get()

        // 1. 메타데이터 추출
        val title = doc.select("meta[property=og:title]").attr("content").ifEmpty { doc.title() }
        val thumbnail = doc.select("meta[property=og:image]").attr("content")

        // 2. 데이터 정제: 분석에 방해되는 태그 제거
        val cleanDoc = doc.clone() // 원본 보존
        cleanDoc.select("script, style, header, footer, nav, aside, form, iframe, .ads, #footer").remove()

        // 3. 본문 텍스트 추출 (최대 5000자 제한 - AI 토큰 절약)
        val rawContent = cleanDoc.body().text()
        val content = if (rawContent.length > 5000) rawContent.substring(0, 5000) else rawContent

        // Redis에 사용자별로 저장 (Key: temp:metadata:{userId}, TTL: 10분)
        return TempMetadataCache(url, title, thumbnail, content)
    }
}