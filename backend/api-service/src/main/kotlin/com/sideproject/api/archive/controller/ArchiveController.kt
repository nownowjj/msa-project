package com.sideproject.api.archive.controller

import com.sideproject.api.archive.dto.ArchiveCreateRequest
import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.service.ArchiveService
import com.sideproject.api.archive.service.GeminiService
import com.sideproject.api.archive.service.ScraperService
import com.sideproject.auth.dto.AuthUser
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/archive")
class ArchiveController(
    private val scraperService : ScraperService,
    private val geminiService: GeminiService,
    private val archiveService: ArchiveService

) {
    private val log = LoggerFactory.getLogger(javaClass)

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


    @PostMapping
    fun createArchive(
        @RequestBody request: ArchiveCreateRequest,
        @AuthenticationPrincipal user: AuthUser
    ): ArchiveResponse {
        return archiveService.createArchive(user.id, request)
    }

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