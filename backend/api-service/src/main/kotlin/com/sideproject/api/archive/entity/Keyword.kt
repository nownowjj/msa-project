package com.sideproject.api.archive.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "keyword",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_keyword_normalized",
            columnNames = ["normalized_keyword"]
        )
    ],
    indexes = [
        Index(name = "idx_keyword_normalized", columnList = "normalized_keyword")
    ]
)
class Keyword(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(nullable = false, length = 100)
    val keyword: String,

    @Column(name = "normalized_keyword", nullable = false, length = 100)
    val normalizedKeyword: String,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
