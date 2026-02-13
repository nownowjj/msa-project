package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.ArchiveCreateRequest
import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.dto.ArchiveUpdateRequest
import com.sideproject.api.archive.entity.Archive
import com.sideproject.api.archive.entity.ArchiveKeyword
import com.sideproject.api.archive.entity.Keyword
import com.sideproject.api.archive.repository.archive.ArchiveRepository
import com.sideproject.api.archive.repository.archiveKeyword.ArchiveKeywordRepository
import com.sideproject.api.archive.repository.keyword.KeywordRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ArchiveService(
    private val archiveRepository: ArchiveRepository,
    private val keywordRepository: KeywordRepository,
    private val archiveKeywordRepository: ArchiveKeywordRepository,
    private val scraperService:ScraperService,
    private val entityManager: EntityManager,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    private val logger = LoggerFactory.getLogger(ArchiveService::class.java)

    @Transactional(readOnly = true)
    // 사용자 전체 조회
    fun getAllArchives(userId: Long): List<ArchiveResponse> {
        val archives = archiveRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        return archives.map { ArchiveResponse.from(it) }
    }

    @Transactional(readOnly = true)
    // 사용자 폴더별 조회
    fun getFolderArchive(userId: Long , folderId :Long): List<ArchiveResponse> {
        val archives = archiveRepository.findAllByUserIdAndFolderIdOrderByCreatedAtDesc(userId , folderId)
        return archives.map { ArchiveResponse.from(it) }
    }

    // Archive 생성
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
        this.saveKeywords(archive , request.keywords)

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
    @Transactional
    fun updateArchive(archiveId: Long, userId: Long, request: ArchiveUpdateRequest): ArchiveResponse {
        val archive = archiveRepository.findByIdWithKeywords(archiveId , userId)
            ?: throw EntityNotFoundException("해당 아카이브가 존재하지 않습니다.")

        // 기본 필드 업데이트
        archive.update(
            title = request.title,
            aiSummary = request.aiSummary,
            folderId = request.folderId,
        )

        // 2. 키워드 로직: 'keywords' 필드가 JSON에 포함되었을 때만 작동
        request.keywords?.let { newKeywords ->
            // 1. 벌크 삭제 실행
            archiveKeywordRepository.deleteByArchiveId(archive.id!!)

            // 2. [매우 중요] DB에 삭제 쿼리를 즉시 전송하여 "실제로" 지워지게 함
            archiveKeywordRepository.flush()


            if (newKeywords.isNotEmpty()) {
                // 4. 이제 깨끗해진 상태에서 다시 저장
                saveKeywords(archive, newKeywords)
            }
        }
        return ArchiveResponse.from(archive).copy(keywords = request.keywords ?: emptyList())
    }

    /** 3. 아카이브 삭제 */
    @Transactional
    fun deleteArchive(archiveId: Long, userId: Long): Long {
        val archive = archiveRepository.findByIdAndUserId(archiveId,userId)
            ?: throw EntityNotFoundException("해당 아카이브가 존재하지 않습니다.")

        //아카이브와 연결된 모든 매핑 정보를 지움.
        archiveKeywordRepository.deleteByArchiveId(archiveId)
        archive.delete()

        // ✅ 트랜잭션 종료 전 강제로 DB에 반영 시도
        archiveRepository.saveAndFlush(archive)

        return archive.id!!
    }


    /**
     * [Private] 키워드 및 매핑 저장 공통 로직
     */
    private fun saveKeywords(archive: Archive, keywords: List<String>?) {
        if(keywords.isNullOrEmpty()) return

        // 1. 전처리: 정규화 및 중복 제거
        val normalizedToOriginal = keywords.filter { it.isNotBlank() }
            .associateBy { normalize(it) } // Map<Normalized, Original>
        val normalizedList = normalizedToOriginal.keys.toList()

        // 2. [Querydsl 사용] 이미 DB에 존재하는 키워드들을 한 번에 조회 (Select 1번)
        val existingKeywords = keywordRepository.findAllByNormalizedKeywords(normalizedList)
        val existingNormalizedNames = existingKeywords.map { it.normalizedKeyword }.toSet()

        // 3. DB에 없는 키워드만 골라내서 새로 생성
        val newKeywordEntities = normalizedList
            .filter { it !in existingNormalizedNames }
            .map { normalized ->
                Keyword(
                    keyword = normalizedToOriginal[normalized]!!.trim(),
                    normalizedKeyword = normalized
                )
            }

        // 4. 새로운 키워드들 벌크 저장
        val savedNewKeywords = keywordRepository.saveAll(newKeywordEntities)

        // 5. 모든 키워드 합치기 (기존 + 신규)
        val allKeywordEntities = existingKeywords + savedNewKeywords

        // 6. 매핑 테이블(ArchiveKeyword) 데이터 준비 및 한 번에 저장 (Insert 1번)
        val mappings = allKeywordEntities.map { keywordEntity ->
            ArchiveKeyword(archive = archive, keyword = keywordEntity)
        }
        val savedMappings = archiveKeywordRepository.saveAll(mappings)

        // 7. 메모리 동기화
        savedMappings.forEach { archive.addArchiveKeyword(it) }
    }

    /**
     * 키워드 정규화 로직 (예: " Kotlin " -> "kotlin")
     */
    private fun normalize(input: String): String =  input.trim().lowercase().replace("\\s+".toRegex(), "")

}