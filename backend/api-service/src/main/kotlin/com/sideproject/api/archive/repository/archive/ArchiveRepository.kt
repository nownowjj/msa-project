package com.sideproject.api.archive.repository.archive

import com.sideproject.api.archive.entity.Archive
import org.springframework.data.jpa.repository.JpaRepository

interface ArchiveRepository: JpaRepository<Archive,Long> , ArchiveRepositoryCustom{
    fun findByIdAndUserId(archiveId: Long ,userId: Long): Archive?
}
