package com.sideproject.api.archive.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(
    name = "folder",
    indexes =[
        Index(name = "idx_folder_parent", columnList = "parent_id"),
        Index(name = "idx_folder_user_use", columnList = "user_id,use_yn"),
        // 수정: 개별 토큰에 대한 인덱스 추가
        Index(name = "idx_folder_view_token", columnList = "view_share_token", unique = true),
        Index(name = "idx_folder_edit_token", columnList = "edit_share_token", unique = true)
    ]
)
class Folder (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    /** 소유 사용자 */
    @Column(name = "user_id", nullable = false)
    val userId: Long,

    /** 상위 폴더 (루트는 null) */
    @Column(name = "parent_id")
    var parentId: Long? = null,

    /** 폴더명 */
    @Column(nullable = false, length = 100)
    var name: String,

    /** 깊이 (1 ~ 3) */
    @Column(nullable = false)
    var depth: Int,

    /** 동일 depth 내 정렬 */
    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

    /** 사용 여부 (Soft Delete) */
    @Column(name = "use_yn", nullable = false, length = 1)
    var useYn: String = "Y",

    /** 공유 활성화 여부 (Master Switch) */
    @Column(name = "is_shared", nullable = false, length = 1)
    var isShared: String = "N",

    /** 조회 전용 토큰 (Can View) */
    @Column(name = "view_share_token", unique = true, length = 50)
    var viewShareToken: String? = null,

    /** 편집 권한 토큰 (Can Edit) */
    @Column(name = "edit_share_token", unique = true, length = 50)
    var editShareToken: String? = null,

    @Column(name = "created_at", updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
) {

    /* ================== domain methods ================== */

    fun isActive(): Boolean = useYn == "Y"

    fun delete() {
        this.useYn = "N"
        this.isShared = "N" // 삭제 시 공유도 중단
    }

    fun updateName(newName: String) {
        if (newName.isBlank()) throw IllegalArgumentException("이름은 비어있을 수 없습니다.")
        this.name = newName
    }

    /**
     * 공유 활성화 (특정 권한의 토큰을 설정)
     */
    fun enableSharing(token: String, role: FolderRole) {
        if (role == FolderRole.EDITOR) {
            this.editShareToken = token
        } else {
            this.viewShareToken = token
        }
        this.isShared = "Y"
    }

    /**
     * 공유 중지 (모든 토큰 무효화 및 마스터 스위치 OFF)
     */
    fun disableSharing() {
        this.isShared = "N"
        // 보안을 위해 공유 중지 시 기존 토큰들을 초기화할 수도 있습니다.
        // this.viewShareToken = null
        // this.editShareToken = null
    }

    /**
     * 특정 토큰을 통한 접근 시 권한 판별
     */
    fun getRoleByToken(token: String): FolderRole? {
        if (isShared == "N" || !isActive()) return null

        return when (token) {
            editShareToken -> FolderRole.EDITOR
            viewShareToken -> FolderRole.VIEWER
            else -> null
        }
    }
}