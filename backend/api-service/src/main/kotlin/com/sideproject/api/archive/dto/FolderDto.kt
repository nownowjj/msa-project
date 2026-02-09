package com.sideproject.api.archive.dto

import com.sideproject.api.archive.entity.Folder

data class FolderTreeResponse(
    val id: Long,
    val name: String,
    val depth: Int,
    val parentId: Long?,
    val sortOrder: Int,
    val archiveCount: Long,
    val children: MutableList<FolderTreeResponse> = mutableListOf()
)

// 쿼리 결과를 담을 임시 DTO (Projections용)
data class FolderCountDto(
    val folder: Folder,
    val archiveCount: Long
)