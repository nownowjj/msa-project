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
    var folderId: Long,

    @Column(nullable = false, length = 1000)
    val url: String,

    @Column(name = "use_yn", nullable = false, length = 1)
    var useYn: String = "Y", // 기본값 'Y' 설정

    @Column(length = 255)
    var title: String? = null,

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    val thumbnailUrl: String? = null,

    @Column(name = "ai_summary", columnDefinition = "TEXT") // 혹은 아예 TEXT 타입으로 지정
    var aiSummary: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()


) {

    @OneToMany(
        mappedBy = "archive",
        fetch = FetchType.LAZY,
    )
    val archiveKeywords: MutableList<ArchiveKeyword> = mutableListOf()

    fun clearKeywords() {
        this.archiveKeywords.clear()
    }

    // 수정 가능 필드 업데이트 로직
    fun update(title: String, aiSummary: String?, folderId: Long) {
        this.title = title
        this.aiSummary = aiSummary
        this.folderId = folderId
    }

    // soft delete 로직
    fun delete() {
        this.useYn = "N"
    }

    // Archive.kt 내부
    fun addArchiveKeyword(archiveKeyword: ArchiveKeyword) {
        this.archiveKeywords.add(archiveKeyword)
    }
}

