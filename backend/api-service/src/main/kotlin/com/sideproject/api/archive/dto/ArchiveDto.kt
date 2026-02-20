package com.sideproject.api.archive.dto

import com.sideproject.api.archive.entity.Archive
import java.time.LocalDateTime


data class ArchiveCreateRequest(
    val url: String,
    val title: String,
    val thumbnailUrl: String?,
    val aiSummary: String?,
    val folderId: Long,
    val keywords: List<String>?
)

data class ArchiveUpdateRequest(
    val title: String,
    val aiSummary: String?,
    val folderId: Long,
    val keywords: List<String>?
)

data class ArchiveResponse(
    val id: Long,
    val userId: Long,
    val folderId: Long,
    val url: String,
    val title: String?,
    val thumbnailUrl: String?,
    val aiSummary: String?,
    val keywords: List<String>, // ArchiveKeyword 엔티티 리스트를 문자열 리스트로 가공
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(archive: Archive): ArchiveResponse {
            return ArchiveResponse(
                id = archive.id,
                userId = archive.userId,
                folderId = archive.folderId,
                url = archive.url,
                title = archive.title ?: "제목 없음", // null 세이프티 처리
                thumbnailUrl = archive.thumbnailUrl,
                aiSummary = archive.aiSummary,
                // 연관 엔티티인 ArchiveKeyword에서 키워드 텍스트만 추출
                keywords = archive.archiveKeywords.map { it.keyword.keyword },
                createdAt = archive.createdAt
            )
        }
        // ✅ 2. 검색 기능(수동 매핑)에서 사용할 새로운 메서드 (추가)
        fun from(archive: Archive, keywords: List<String>): ArchiveResponse {
            return ArchiveResponse(
                id = archive.id,
                userId = archive.userId,
                folderId = archive.folderId,
                url = archive.url,
                title = archive.title ?: "제목 없음",
                thumbnailUrl = archive.thumbnailUrl,
                aiSummary = archive.aiSummary,
                keywords = keywords, // 외부에서 주입받은 키워드 사용
                createdAt = archive.createdAt
            )
        }
    }
}