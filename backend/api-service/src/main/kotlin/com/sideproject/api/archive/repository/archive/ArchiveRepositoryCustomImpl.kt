package com.sideproject.api.archive.repository.archive

import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sideproject.api.archive.entity.Archive
import com.sideproject.api.archive.entity.QArchive
import com.sideproject.api.archive.entity.QArchiveKeyword
import com.sideproject.api.archive.entity.QKeyword
import org.springframework.stereotype.Repository

@Repository
class ArchiveRepositoryCustomImpl(
    private val queryFactory: JPAQueryFactory
) : ArchiveRepositoryCustom {

    private val archive = QArchive.archive
    private val archiveKeyword = QArchiveKeyword.archiveKeyword
    private val keyword = QKeyword.keyword1

    override fun findByIdWithKeywords(archiveId: Long, userId: Long): Archive? {

        return queryFactory
            .selectFrom(archive)
            .leftJoin(archive.archiveKeywords, archiveKeyword).fetchJoin() // 매핑 테이블 조인
            .leftJoin(archiveKeyword.keyword, keyword).fetchJoin()         // 키워드 테이블 조인
            .where(
                archive.id.eq(archiveId),
                archive.userId.eq(userId),
                useYnEq("Y")
            )
            .fetchOne()
    }

    // 1. 전체 조회
    override fun findAllByUserIdOrderByCreatedAtDesc(userId: Long): List<Archive> {
        return fetchArchivesWithKeywords(userId, null)
    }

    // 2. 폴더별 조회
    override fun findAllByUserIdAndFolderIdOrderByCreatedAtDesc(userId: Long, folderId: Long): List<Archive> {
        return fetchArchivesWithKeywords(userId, folderId)
    }

    /**
     * [공통 로직] 페치 조인과 정렬을 포함한 아카이브 조회
     */
    private fun fetchArchivesWithKeywords(userId: Long, folderId: Long?): List<Archive> {
        return queryFactory
            .selectFrom(archive)
            // 목록 조회에서도 키워드를 같이 보여줘야 하므로 fetchJoin 적용
            .leftJoin(archive.archiveKeywords, archiveKeyword).fetchJoin()
            .leftJoin(archiveKeyword.keyword, keyword).fetchJoin()
            .where(
                archive.userId.eq(userId),
                useYnEq("Y"),
                folderIdEq(folderId) // null이면 조건에서 무시됨
            )
            .orderBy(archive.createdAt.desc())
            .fetch()
    }

    /**
     * [공통 조건] 폴더 ID 조건문 (Dynamic Query)
     */
    private fun folderIdEq(folderId: Long?): BooleanExpression? {
        return folderId?.let { archive.folderId.eq(it) }
    }

    /**
     * [공통 조건] 사용 여부 조건 (Y/N)
     */
    private fun useYnEq(useYn: String): BooleanExpression {
        return archive.useYn.eq(useYn)
    }
}