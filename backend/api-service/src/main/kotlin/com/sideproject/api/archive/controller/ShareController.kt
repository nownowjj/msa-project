package com.sideproject.api.archive.controller

import com.sideproject.api.archive.dto.ShareFolderRequest
import com.sideproject.api.archive.dto.ShareFolderResponse
import com.sideproject.api.archive.dto.SharedFolderResponse
import com.sideproject.api.archive.service.ShareService
import com.sideproject.auth.dto.AuthUser
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/share")
class ShareController(
    private val shareService: ShareService
) {
    /**
     * 공유 토큰을 통한 폴더 및 아카이브 목록 조회
     * 비로그인 사용자도 접근 가능해야 함
     */
    @GetMapping("/public/{token}")
    fun getSharedFolder(
        @PathVariable token: String,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<SharedFolderResponse> {
        val response = shareService.getSharedArchivesByToken(token, pageable)
        return ResponseEntity.ok(response)
    }

    @PostMapping
    fun shareFolder(
        @AuthenticationPrincipal user: AuthUser,
        @RequestBody request: ShareFolderRequest
    ): ResponseEntity<ShareFolderResponse> {
        val response = shareService.generateShareLink(user.id, request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/auto/{token}")
    fun participate(
        @AuthenticationPrincipal user: AuthUser,
        @PathVariable token: String
    ): ResponseEntity<Unit> {
        shareService.autoGenerateFolderByToken(token, user.id)
        return ResponseEntity.ok().build()
    }
}