package com.sideproject.api.archive.repository.keyword

import com.querydsl.jpa.impl.JPAQueryFactory
import com.sideproject.api.archive.entity.Keyword
import com.sideproject.api.archive.entity.QKeyword
import org.springframework.stereotype.Repository

@Repository
class KeywordRepositoryCustomImpl (
    private val queryFactory: JPAQueryFactory,
): KeywordRepositoryCustom {

    override fun findAllByNormalizedKeywords(normalizedKeywords: List<String>): List<Keyword> {
        val k = QKeyword.keyword1
        return queryFactory
            .selectFrom(k)
            .where(k.normalizedKeyword.`in`(normalizedKeywords))
            .fetch()
    }
}