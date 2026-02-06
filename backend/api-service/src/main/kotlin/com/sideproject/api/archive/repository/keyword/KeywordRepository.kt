package com.sideproject.api.archive.repository.keyword

import com.sideproject.api.archive.entity.Keyword
import org.springframework.data.jpa.repository.JpaRepository

interface KeywordRepository: JpaRepository<Keyword, Long>, KeywordRepositoryCustom {
    fun findByNormalizedKeyword(normalizedKeyword: String): Keyword?
}