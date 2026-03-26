package com.sideproject.api.archive.repository.archive

import com.sideproject.api.archive.dto.FolderCountDto
import com.sideproject.api.archive.entity.Archive
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ArchiveRepository: JpaRepository<Archive,Long> , ArchiveRepositoryCustom{
    fun findByIdAndUserId(archiveId: Long ,userId: Long): Archive?
    fun findByIdAndUseYn(archiveId: Long ,useYn: String): Archive?


    // ✅ 케이스 1: 본인의 활성화된 모든 아카이브 조회
    fun findAllByUserIdAndUseYn(userId: Long, useYn: String = "Y", pageable: Pageable): Page<Archive>

    // 케이스 2 & 3: 폴더 ID 기반 조회 (이미 서비스에서 권한 검증됨)
    // 본인 폴더든 공유 폴더든, 권한만 있다면 해당 폴더의 모든 아카이브를 보여줍니다.
    fun findAllByFolderId(folderId: Long, pageable: Pageable): Page<Archive>

    // 물리적 삭제는 고려 하도록 하자
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Archive a WHERE a.folderId IN :folderIds")
    fun deleteByFolderIds(folderIds: List<Long>)

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Archive a SET a.useYn = 'N' WHERE a.folderId IN :folderIds")
    fun softDeleteByFolderIds(@Param("folderIds") folderIds: List<Long>)

    fun findAllByFolderIdAndUseYn(folderId: Long, useYn: String, pageable: Pageable ): Page<Archive>

    // ✅ 공유받은 폴더 ID 리스트를 넣어 폴더별 개수를 가져옵니다.
    @Query("""
        SELECT new com.sideproject.api.archive.dto.FolderCountDto(f, COUNT(a))
        FROM Folder f
        LEFT JOIN Archive a ON f.id = a.folderId AND a.useYn = 'Y'
        WHERE f.id IN :folderIds
        GROUP BY f.id
    """)
    fun findAllFolderCountsByFolderIds(folderIds: List<Long>): List<FolderCountDto>
}
