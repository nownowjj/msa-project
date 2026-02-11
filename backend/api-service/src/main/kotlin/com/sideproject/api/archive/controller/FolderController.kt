package com.sideproject.api.archive.controller

import com.sideproject.api.archive.dto.FolderCreateRequest
import com.sideproject.api.archive.dto.FolderTreeResponse
import com.sideproject.api.archive.dto.FolderUpdateRequest
import com.sideproject.api.archive.service.FolderService
import com.sideproject.auth.dto.AuthUser
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/folder")
class FolderController (
    private val folderService: FolderService,
){

    @GetMapping
    fun getFolders(@AuthenticationPrincipal user: AuthUser): List<FolderTreeResponse> {
        return folderService.getFolders(user.id)
    }

    /** 폴더 생성 */
    @PostMapping
    fun createFolder(
        @AuthenticationPrincipal user: AuthUser,
        @RequestBody request: FolderCreateRequest
    ): Long {
        return folderService.createFolder(user.id, request)
    }

    /** 폴더 수정 (이름 변경 및 계층 이동) */
    @PatchMapping("/{folderId}")
    fun updateFolder(
        @AuthenticationPrincipal user: AuthUser,
        @PathVariable folderId: Long,
        @RequestBody request: FolderUpdateRequest
    ) {
        folderService.updateFolder(user.id, folderId, request)
    }

    /** 폴더 삭제 */
    @DeleteMapping("/{folderId}")
    fun deleteFolder(
        @AuthenticationPrincipal user: AuthUser,
        @PathVariable folderId: Long
    ) {
        folderService.deleteFolder(user.id, folderId)
    }
}