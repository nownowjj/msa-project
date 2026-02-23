package com.sideproject.api.archive.repository.archive

import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.entity.Archive
import com.sideproject.api.archive.entity.QArchive
import com.sideproject.api.archive.entity.QArchiveKeyword
import com.sideproject.api.archive.entity.QKeyword
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.support.PageableExecutionUtils
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
//    override fun findAllByUserIdOrderByCreatedAtDesc(userId: Long): List<Archive> {
//        return fetchArchivesWithKeywords(userId, null)
//    }

    // 2. 폴더별 조회
//    override fun findAllByUserIdAndFolderIdOrderByCreatedAtDesc(userId: Long, folderId: Long): List<Archive> {
//        return fetchArchivesWithKeywords(userId, folderId)
//    }

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

    override fun searchArchives(userId: Long,searchQuery: String,pageable: Pageable): Page<Archive> {
        val query = searchQuery.trim()

        // 1. 콘텐츠 조회를 위한 메인 쿼리
        val content = queryFactory
            .selectFrom(archive)
            .distinct()
            .leftJoin(archiveKeyword).on(archiveKeyword.archive.eq(archive))
            .leftJoin(archiveKeyword.keyword, keyword)
            .where(
                archive.userId.eq(userId),
                archive.useYn.eq("Y"),
                // 검색 조건: 제목 OR URL OR 키워드
                archive.title.containsIgnoreCase(query)
                    .or(archive.url.containsIgnoreCase(query))
                    .or(keyword.normalizedKeyword.containsIgnoreCase(query))
            )
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .orderBy(archive.createdAt.desc())
            .fetch()

        // 2. 전체 개수 조회를 위한 카운트 쿼리 (최적화)
        val countQuery = queryFactory
            .select(archive.countDistinct())
            .from(archive)
            .leftJoin(archiveKeyword).on(archiveKeyword.archive.eq(archive))
            .leftJoin(archiveKeyword.keyword, keyword)
            .where(
                archive.userId.eq(userId),
                archive.useYn.eq("Y"),
                archive.title.containsIgnoreCase(query)
                    .or(archive.url.containsIgnoreCase(query))
                    .or(keyword.keyword.containsIgnoreCase(query))
            )

        // 3. PageableExecutionUtils를 사용하여 Page 객체 반환
        // (첫 페이지가 마지막 페이지보다 작거나 결과가 비어있으면 카운트 쿼리를 생략함)
        return PageableExecutionUtils.getPage(content, pageable) {
            countQuery.fetchOne() ?: 0L
        }
    }

    // ArchiveRepositoryCustomImpl.kt

    override fun findArchivesPaging(userId: Long, folderId: Long?, pageable: Pageable): Page<Archive> {
        // 1. 페이징된 데이터 조회 (키워드 없이 Archive만)
        val content = queryFactory
            .selectFrom(archive)
            .where(
                archive.userId.eq(userId),
                useYnEq("Y"),
                folderIdEq(folderId)
            )
            .orderBy(archive.createdAt.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        // 2. 전체 카운트 조회 (페이징 최적화용)
        val countQuery = queryFactory
            .select(archive.count())
            .from(archive)
            .where(
                archive.userId.eq(userId),
                useYnEq("Y"),
                folderIdEq(folderId)
            )

        return PageableExecutionUtils.getPage(content, pageable) {
            countQuery.fetchOne() ?: 0L
        }
    }
}