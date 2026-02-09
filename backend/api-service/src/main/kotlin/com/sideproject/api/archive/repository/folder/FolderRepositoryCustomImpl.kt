package com.sideproject.api.archive.repository.folder

import com.querydsl.core.QueryFactory
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sideproject.api.archive.dto.FolderCountDto
import com.sideproject.api.archive.entity.QArchive
import com.sideproject.api.archive.entity.QFolder
import org.springframework.stereotype.Repository

@Repository
class FolderRepositoryCustomImpl (
    private val queryFactory: JPAQueryFactory
): FolderRepositoryCustom {

    override fun findAllWithArchiveCount(userId: Long): List<FolderCountDto> {
        val f = QFolder.folder
        val a = QArchive.archive

        return queryFactory
            .select(
                Projections.constructor(
                    FolderCountDto::class.java,
                    f,
                    a.count().coalesce(0L) // 아카이브가 없으면 0으로 처리
                )
            )
            .from(f)
            .leftJoin(a).on(a.folderId.eq(f.id).and(a.useYn.eq("Y"))) // 활성화된 아카이브만 카운트
            .where(
                f.userId.eq(userId),
                f.useYn.eq("Y")
            )
            .groupBy(f.id)
            .orderBy(f.depth.asc(), f.sortOrder.asc()) // 1차 정렬
            .fetch()
    }
}