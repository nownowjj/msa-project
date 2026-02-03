package com.sideproject.api.archive.controller

import com.sideproject.api.archive.dto.ArchiveCreateRequest
import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.service.ArchiveService
import com.sideproject.api.archive.service.GeminiService
import com.sideproject.api.archive.service.ScraperService
import com.sideproject.auth.dto.AuthUser
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/archive")
class ArchiveController(
    private val scraperService : ScraperService,
    private val geminiService: GeminiService,
    private val archiveService: ArchiveService

) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GetMapping("/test")
    fun testArchive(@RequestParam url: String): ResponseEntity<Any> {
        return try {
            // 1. URL에서 메타데이터 및 본문 추출
            val metadata = scraperService.extract(url)
            log.info("metadata : ${metadata}")

            // 2. 추출된 본문이 너무 비어있는지 체크
            if (metadata.content.isBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "본문을 추출할 수 없는 사이트입니다."))
            }

            // 3. Gemini AI를 이용한 분석 (요약, 키워드, 카테고리)
            val aiResult = geminiService.analyzeContent(metadata.content)

            // 4. 최종 결과 조합하여 반환
            val response = mapOf(
                "url" to url,
                "title" to metadata.title,
                "thumbnail" to metadata.thumbnail,
                "analysis" to aiResult,
                "rawContentPreview" to metadata.content.take(200) + "..." // 확인용 프리뷰
            )

            ResponseEntity.ok(response)

        } catch (e: Exception) {
            // 스크래핑 실패나 AI 호출 실패 시 에러 메시지 반환
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                    mapOf(
                        "message" to "분석 중 오류가 발생했습니다.",
                        "details" to e.message
                    )
                )
        }
    }


    /** 본인 전체 아카이브 목록 조회 */
    @GetMapping
    fun getMyArchives(
        @AuthenticationPrincipal user: AuthUser
    ): List<ArchiveResponse> {
        return archiveService.getMyArchives(user.id)
    }

    /** 본인 폴더 아카이브  조회 */
    @GetMapping("/{folderId}")
    fun getMyArchive(
        @PathVariable folderId : Long,
        @AuthenticationPrincipal user: AuthUser
    ): List<ArchiveResponse> {
        return archiveService.getMyFolderArchive(user.id, folderId)
    }

    /** 아카이브 생성 */
//    @PostMapping
//    fun createArchive(
//        @RequestBody request: ArchiveCreateRequest,
//        @AuthenticationPrincipal user: AuthUser
//    ): ArchiveResponse {
//        return archiveService.createArchive(user.id, request)
//    }
//
//    /** 아카이브 수정 */
//    @PutMapping("/{id}")
//    fun updateArchive(
//        @PathVariable id: Long,
//        @RequestBody request: ArchiveUpdateRequest,
//        @AuthenticationPrincipal user: UserPrincipal
//    ): ArchiveResponse {
//        return archiveService.updateArchive(id, user.name, request)
//    }
//
//    /** 아카이브 삭제 */
//    @DeleteMapping("/{id}")
//    fun deleteArchive(
//        @PathVariable id: Long,
//        @AuthenticationPrincipal user: UserPrincipal
//    ) {
//        archiveService.deleteArchive(id, user.name)
//    }

}