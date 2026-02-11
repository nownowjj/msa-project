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

/** 폴더 생성 요청 */
data class FolderCreateRequest(
    val name: String,
    val parentId: Long? = null
)

/** 폴더 수정 요청 (이름 및 위치 이동) */
data class FolderUpdateRequest(
    val name: String?,
    val parentId: Long?
)