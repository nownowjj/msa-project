package com.sideproject.api.archive.repository

import com.sideproject.api.archive.entity.Archive
import org.springframework.data.jpa.repository.JpaRepository

interface ArchiveRepository: JpaRepository<Archive,Long> {
    // 최신순 정렬을 위해 OrderBy 추가
    fun findAllByUserIdOrderByCreatedAtDesc(userId: Long): List<Archive>

    fun findAllByUserIdAndFolderIdOrderByCreatedAtDesc(userId: Long , folderId: Long): List<Archive>
}