package com.sideproject.api.archive.repository.keyword

import com.sideproject.api.archive.entity.Keyword

interface KeywordRepositoryCustom {

    fun findAllByNormalizedKeywords(normalizedKeywords: List<String>): List<Keyword>
}