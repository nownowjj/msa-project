package com.sideproject.api.archive.entity

import jakarta.persistence.*

@Entity
@Table(
    name = "archive_keyword",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_archive_keyword",
            columnNames = ["archive_id", "keyword_id"]
        )
    ],
    indexes = [
        Index(name = "idx_archive_keyword_keyword", columnList = "keyword_id"),
        Index(name = "idx_archive_keyword_archive", columnList = "archive_id")
    ]
)
class ArchiveKeyword(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "archive_id", nullable = false)
    val archive: Archive,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyword_id", nullable = false)
    val keyword: Keyword
)
