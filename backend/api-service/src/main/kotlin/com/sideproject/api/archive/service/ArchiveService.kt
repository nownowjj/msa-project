package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.repository.ArchiveRepository
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ArchiveService(
    private val archiveRepository: ArchiveRepository,
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

    // 1 & 2단계: URL 입력 시 메타데이터 추출 및 임시 저장
//    fun scrapAndCache(url: String, userId: Long): UrlMetadataResponse {
//        // 크롤링 수행 및 레디스 캐싱
//        val metadata = scraperService.extract(url ,userId)
//
//        // Redis에 임시 저장 (UserId + URL 해시를 키로 사용 추천)
//        val cacheKey = "temp:metadata:$userId"
//        redisTemplate.opsForValue().set(cacheKey, metadata, Duration.ofMinutes(10))
//
//        return UrlMetadataResponse(metadata.title, metadata.thumbnailUrl)
//    }


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
}