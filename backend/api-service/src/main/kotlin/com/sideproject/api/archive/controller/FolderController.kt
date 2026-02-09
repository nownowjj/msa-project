package com.sideproject.api.archive.controller

import com.sideproject.api.archive.dto.FolderTreeResponse
import com.sideproject.api.archive.entity.Folder
import com.sideproject.api.archive.repository.folder.FolderRepository
import com.sideproject.api.archive.service.FolderService
import com.sideproject.auth.dto.AuthUser
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/folder")
class FolderController (
    private val folderService: FolderService,
){

    @GetMapping
    fun getFolders(
        @AuthenticationPrincipal user: AuthUser
    ): List<FolderTreeResponse> {
        return folderService.getFolders(user.id)
    }
}