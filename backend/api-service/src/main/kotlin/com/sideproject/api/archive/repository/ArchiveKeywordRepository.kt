package com.sideproject.api.archive.repository

import com.sideproject.api.archive.entity.ArchiveKeyword
import org.springframework.data.jpa.repository.JpaRepository

interface ArchiveKeywordRepository: JpaRepository<ArchiveKeyword,Long> {
}