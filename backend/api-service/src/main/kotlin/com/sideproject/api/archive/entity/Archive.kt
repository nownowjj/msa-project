package com.sideproject.api.archive.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "archive",
    indexes = [
        Index(name = "idx_archive_user", columnList = "user_id"),
        Index(name = "idx_archive_folder", columnList = "folder_id"),
        Index(name = "idx_archive_user_folder", columnList = "user_id,folder_id")
    ]
)
class Archive(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Column(name = "folder_id", nullable = false)
    val folderId: Long,

    @Column(nullable = false)
    val url: String,

    @Column(name = "use_yn", nullable = false, length = 1)
    var useYn: String = "Y", // 기본값 'Y' 설정

    @Column(length = 255)
    val title: String? = null,

    @Column(name = "thumbnail_url")
    val thumbnailUrl: String? = null,

    @Column(name = "ai_summary")
    val aiSummary: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()


) {

    @OneToMany(
        mappedBy = "archive",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    val archiveKeywords: MutableList<ArchiveKeyword> = mutableListOf()
}

