package com.sideproject.api.archive.repository.folder

import com.sideproject.api.archive.entity.Folder

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query


interface FolderRepository: JpaRepository<Folder, Long>, FolderRepositoryCustom {

    fun findByIdAndUserId(id: Long, userId: Long): Folder?

    // 부모 ID로 모든 자식 찾기 (이동 시 depth 연쇄 수정용)
    fun findAllByParentId(parentId: Long): List<Folder>

    @Query(value = """
        WITH RECURSIVE FolderHierarchy AS (
            SELECT id FROM folder WHERE id = :folderId AND user_id = :userId
            UNION ALL
            SELECT f.id FROM folder f
            INNER JOIN FolderHierarchy fh ON f.parent_id = fh.id
            WHERE f.use_yn = 'Y'
        )
        SELECT id FROM FolderHierarchy
    """, nativeQuery = true)
    fun findAllChildIdsRecursive(folderId: Long, userId: Long): List<Long>

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Folder f WHERE f.id IN :ids")
    fun deleteAllByIdIn(ids: List<Long>)
}