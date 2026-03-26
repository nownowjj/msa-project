package com.sideproject.api.archive.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "folder_member",
    indexes = [
        Index(name = "idx_folder_member_user", columnList = "user_id"),
        Index(name = "idx_folder_member_folder", columnList = "folder_id")
    ],
    // 한 유저가 같은 폴더를 중복해서 공유받지 않도록 복합 유니크 제약 추가
    uniqueConstraints = [
        UniqueConstraint(name = "uk_folder_member_user_folder", columnNames = ["folder_id", "user_id"])
    ]
)
class FolderMember(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    /** 공유된 폴더 ID */
    @Column(name = "folder_id", nullable = false)
    val folderId: Long,

    /** 공유를 받은 사용자 ID */
    @Column(name = "user_id", nullable = false)
    val userId: Long,

    /** * 부여된 권한 역할 (VIEWER, EDITOR)
     * 이 권한에 따라 아카이브 추가 가능 여부가 결정됩니다.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var role: FolderRole,

    @Column(name = "created_at", updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)

enum class FolderRole {
    VIEWER, EDITOR , OWNER
}