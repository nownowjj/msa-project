package com.sideproject.api.archive.repository.archiveKeyword

import com.sideproject.api.archive.entity.ArchiveKeyword

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface ArchiveKeywordRepository: JpaRepository<ArchiveKeyword, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from ArchiveKeyword ak where ak.archive.id = :archiveId")
    fun deleteByArchiveId(archiveId: Long) : Int

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM ArchiveKeyword ak WHERE ak.archive.id IN (SELECT a.id FROM Archive a WHERE a.folderId IN :folderIds)")
    fun deleteByFolderIds(folderIds: List<Long>)
}