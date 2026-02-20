package com.sideproject.api.archive.repository.archive

import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.entity.Archive
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface ArchiveRepositoryCustom {
    fun findByIdWithKeywords(archiveId: Long, userId: Long): Archive?

    // 사용자 전체 아카이브 조회
//    fun findAllByUserIdOrderByCreatedAtDesc(userId: Long): List<Archive>

    // 사용자 폴더 아카이브 조회
//    fun findAllByUserIdAndFolderIdOrderByCreatedAtDesc(userId: Long, folderId: Long): List<Archive>

    fun searchArchives(userId: Long , query: String, pageable: Pageable): Page<Archive>

    fun findArchivesPaging(userId: Long , folderId: Long?, pageable: Pageable): Page<Archive>
}