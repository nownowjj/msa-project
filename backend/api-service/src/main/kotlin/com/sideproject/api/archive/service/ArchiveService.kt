package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.ArchiveCreateRequest
import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.entity.Archive
import com.sideproject.api.archive.entity.ArchiveKeyword
import com.sideproject.api.archive.entity.Keyword
import com.sideproject.api.archive.repository.ArchiveKeywordRepository
import com.sideproject.api.archive.repository.ArchiveRepository
import com.sideproject.api.archive.repository.KeywordRepository
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ArchiveService(
    private val archiveRepository: ArchiveRepository,
    private val keywordRepository: KeywordRepository,
    private val archiveKeywordRepository: ArchiveKeywordRepository,
    private val scraperService:ScraperService,
    private val redisTemplate: RedisTemplate<String, Any>
) {

    @Transactional(readOnly = true)
    fun getMyArchives(userId: Long): List<ArchiveResponse> {
        val archives = archiveRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        return archives.map { ArchiveResponse.from(it) }
    }

    @Transactional(readOnly = true)
    fun getMyFolderArchive(userId: Long , folderId :Long): List<ArchiveResponse> {
        val archives = archiveRepository.findAllByUserIdAndFolderIdOrderByCreatedAtDesc(userId , folderId)
        return archives.map { ArchiveResponse.from(it) }
    }

    @Transactional
    fun createArchive(userId: Long, request: ArchiveCreateRequest): ArchiveResponse {
        // 1. Archive 엔티티 생성 및 저장
        val archive = Archive(
            userId = userId,
            folderId = request.folderId,
            url = request.url,
            title = request.title,
            thumbnailUrl = request.thumbnailUrl,
            aiSummary  = request.aiSummary
        )
        val savedArchive = archiveRepository.save(archive)

        // 3. Keyword 및 ArchiveKeyword 매핑 처리
        request.keywords?.filter { it.isNotBlank() }?.forEach { originalKeyword ->
            // (1) 키워드 정규화 (예: 공백 제거, 소문자화 등)
            val normalized = normalize(originalKeyword)

            // (2) 정규화된 키워드로 기존 키워드 존재 여부 확인 (Find or Create)
            val keywordEntity = keywordRepository.findByNormalizedKeyword(normalized)
                ?: keywordRepository.save(
                    Keyword(
                        keyword = originalKeyword.trim(),
                        normalizedKeyword = normalized
                    )
                )

            // (3) 아카이브-키워드 연관 관계 저장
            archiveKeywordRepository.save(
                ArchiveKeyword(
                    archive = savedArchive,
                    keyword = keywordEntity
                )
            )
        }



        // 서비스 하단에서 직접 조립하여 반환
        //  ㄴ 응답 시에는 DB 엔티티의 리스트가 아닌, 방금 우리가 처리한 데이터를 직접 주입
        return ArchiveResponse(
            id = savedArchive.id,
            userId = savedArchive.userId,
            folderId = savedArchive.folderId,
            url = savedArchive.url,
            title = savedArchive.title,
            thumbnailUrl = savedArchive.thumbnailUrl,
            aiSummary = savedArchive.aiSummary,
            keywords = request.keywords ?: emptyList(),
            createdAt = savedArchive.createdAt
        )
    }



    /** 2. 아카이브 수정 */
//    fun updateArchive(userId: Long, archiveId: Long, request: ArchiveUpdateRequest): ArchiveResponse {
//        val archive = archiveRepository.findByIdOrNull(archiveId)
//            ?: throw EntityNotFoundException("해당 아카이브가 존재하지 않습니다.")
//
//        // 권한 검증: 데이터의 주인과 현재 로그인한 유저가 같은지 확인
//        if (archive.userId != userId) {
//            throw AccessDeniedException("수정 권한이 없습니다.")
//        }
//
//        archive.update(request.title, request.memo) // Entity 내부에서 변경 감지(Dirty Checking) 활용
//        return ArchiveResponse.from(archive)
//    }

    /** 3. 아카이브 삭제 */
//    fun deleteArchive(userId: Long, archiveId: Long) {
//        val archive = archiveRepository.findByIdOrNull(archiveId)
//            ?: throw EntityNotFoundException("해당 아카이브가 존재하지 않습니다.")
//
//        if (archive.userId != userId) {
//            throw AccessDeniedException("삭제 권한이 없습니다.")
//        }
//
//        archiveRepository.delete(archive)
//    }

    /**
     * 키워드 정규화 로직 (예: " Kotlin " -> "kotlin")
     */
    private fun normalize(input: String): String {
        return input.trim().lowercase().replace("\\s+".toRegex(), "")
    }
}