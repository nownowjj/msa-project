package com.sideproject.api.archive.repository.archiveKeyword

import com.sideproject.api.archive.entity.ArchiveKeyword
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying

interface ArchiveKeywordRepository: JpaRepository<ArchiveKeyword, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from ArchiveKeyword ak where ak.archive.id = :archiveId")
    fun deleteByArchiveId(archiveId: Long) : Int
}