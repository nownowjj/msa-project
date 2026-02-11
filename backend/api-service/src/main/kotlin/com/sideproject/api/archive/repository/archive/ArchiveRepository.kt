package com.sideproject.api.archive.repository.archive

import com.sideproject.api.archive.entity.Archive
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ArchiveRepository: JpaRepository<Archive,Long> , ArchiveRepositoryCustom{
    fun findByIdAndUserId(archiveId: Long ,userId: Long): Archive?

    // 물리적 삭제는 고려 하도록 하자
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Archive a WHERE a.folderId IN :folderIds")
    fun deleteByFolderIds(folderIds: List<Long>)

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Archive a SET a.useYn = 'N' WHERE a.folderId IN :folderIds")
    fun softDeleteByFolderIds(@Param("folderIds") folderIds: List<Long>)
}
