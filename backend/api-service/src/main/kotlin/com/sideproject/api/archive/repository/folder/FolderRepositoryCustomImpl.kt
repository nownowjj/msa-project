package com.sideproject.api.archive.repository.folder

import com.querydsl.core.QueryFactory
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sideproject.api.archive.dto.FolderCountDto
import com.sideproject.api.archive.entity.QArchive.archive
import com.sideproject.api.archive.entity.QFolder.folder
import org.springframework.stereotype.Repository

@Repository
class FolderRepositoryCustomImpl (
    private val queryFactory: JPAQueryFactory
): FolderRepositoryCustom {

    override fun findAllWithArchiveCount(userId: Long): List<FolderCountDto> {

        return queryFactory
            .select(
                Projections.constructor(
                    FolderCountDto::class.java,
                    folder,
                    archive.count().coalesce(0L) // 아카이브가 없으면 0으로 처리
                )
            )
            .from(folder)
            .leftJoin(archive).on(archive.folderId.eq(folder.id).and(archive.useYn.eq("Y"))) // 활성화된 아카이브만 카운트
            .where(
                folder.userId.eq(userId),
                folder.useYn.eq("Y")
            )
            .groupBy(folder.id)
            .orderBy(folder.depth.asc(), folder.sortOrder.asc()) // 1차 정렬
            .fetch()
    }

    override fun findMaxSortOrder(userId: Long, parentId: Long?): Int {
        return queryFactory
            .select(folder.sortOrder.max().coalesce(0))
            .from(folder)
            .where(
                folder.userId.eq(userId),
                folder.useYn.eq("Y"), // 삭제되지 않은 폴더만 대상으로 함
                parentIdEq(parentId)  // 동적 조건 메서드 호출
            )
            .fetchOne() ?: 0
    }

    // ✅ 핵심: parentId가 null일 때와 아닐 때를 명확히 구분
    private fun parentIdEq(parentId: Long?): BooleanExpression {
        return if (parentId == null) {
            folder.parentId.isNull
        } else {
            folder.parentId.eq(parentId)
        }
    }
}