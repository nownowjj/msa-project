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
        Index(name = "idx_folder_user_use", columnList = "user_id,use_yn")
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
    val parentId: Long? = null,

    /** 폴더명 */
    @Column(nullable = false, length = 100)
    var name: String,

    /** 깊이 (1 ~ 3) */
    @Column(nullable = false)
    var depth: Int,

    /**
     * 계층 경로
     * 예: /1/3/7/
     */
//    @Column(nullable = false, length = 255)
//    var path: String,

    /** 동일 depth 내 정렬 */
    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

    /** 사용 여부 (Soft Delete) */
    @Column(name = "use_yn", nullable = false, length = 1)
    var useYn: String = "Y",

    @Column(name = "created_at", updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
) {

    /* ================== domain methods ================== */

    fun isActive(): Boolean = useYn == "Y"

    fun softDelete() {
        this.useYn = "N"
    }

    fun rename(newName: String) {
        this.name = newName
    }
}