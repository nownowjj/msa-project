package com.sideproject.api.archive.repository.folder

import com.sideproject.api.archive.entity.Folder

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query


interface FolderRepository: JpaRepository<Folder, Long>, FolderRepositoryCustom {
    // ✅ 1. 특정 폴더의 소유자인지 확인 (가장 효율적인 SELECT 1 방식)
    fun existsByIdAndUserId(id: Long, userId: Long): Boolean

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

    // 특정 유저의 최상위(parentId is null) 폴더 중 이름이 "기본"인 것 찾기
    fun existsByUserIdAndParentIdIsNullAndName(userId: Long, name: String): Boolean

    // 두 토큰 중 하나라도 일치하고, 공유 활성화(isShared='Y') 및 삭제되지 않은 폴더 조회
    @Query("""
        SELECT f FROM Folder f 
        WHERE (f.viewShareToken = :token OR f.editShareToken = :token) 
          AND f.isShared = 'Y' 
          AND f.useYn = 'Y'
    """)
    fun findByActiveShareToken(token: String): Folder?

    // view_share_token 혹은 edit_share_token 필드 중 매칭되는 폴더 반환
    fun findByViewShareTokenOrEditShareToken(viewToken: String, editToken: String): Folder?

    // 루트 ID들이거나, 그 루트 ID들을 부모로 가진 폴더들 조회
    fun findAllByIdInOrParentIdIn(ids: List<Long>, parentIds: List<Long>): List<Folder>
}