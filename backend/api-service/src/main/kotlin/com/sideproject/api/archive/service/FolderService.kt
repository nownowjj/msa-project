package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.FolderTreeResponse
import com.sideproject.api.archive.entity.Folder
import com.sideproject.api.archive.repository.folder.FolderRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class FolderService (
    private val folderRepository: FolderRepository
){

    @Transactional
    fun getFolders(userId: Long): List<FolderTreeResponse> {
        // 1. DB 조회 (평면 구조)
        val folderDtos = folderRepository.findAllWithArchiveCount(userId)

        // 2. Response DTO로 변환 및 Map에 저장 (빠른 조회를 위해)
        val allFolders = folderDtos.map { dto ->
            FolderTreeResponse(
                id = dto.folder.id,
                name = dto.folder.name,
                depth = dto.folder.depth,
                parentId = dto.folder.parentId,
                sortOrder = dto.folder.sortOrder,
                archiveCount = dto.archiveCount
            )
        }

        val folderMap = allFolders.associateBy { it.id }
        val rootFolders = mutableListOf<FolderTreeResponse>()

        // 3. 트리 구조 조립
        allFolders.forEach { folder ->
            if (folder.parentId == null) {
                rootFolders.add(folder)
            } else {
                folderMap[folder.parentId]?.children?.add(folder)
            }
        }

        // 4. 각 계층별 sortOrder 정렬 (필요 시)
        rootFolders.forEach { sortRecursive(it) }
        return rootFolders.sortedBy { it.sortOrder }
    }

    private fun sortRecursive(folder: FolderTreeResponse) {
        folder.children.sortBy { it.sortOrder }
        folder.children.forEach { sortRecursive(it) }
    }
}