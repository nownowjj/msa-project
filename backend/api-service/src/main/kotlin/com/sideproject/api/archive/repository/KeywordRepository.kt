package com.sideproject.api.archive.repository

import com.sideproject.api.archive.entity.Keyword
import org.springframework.data.jpa.repository.JpaRepository

interface KeywordRepository: JpaRepository<Keyword,Long> {
    fun findByNormalizedKeyword(normalizedKeyword: String): Keyword?
}