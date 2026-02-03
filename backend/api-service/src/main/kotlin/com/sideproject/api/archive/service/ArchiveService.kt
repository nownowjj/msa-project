package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.dto.ArchiveUpdateRequest
import com.sideproject.api.archive.repository.ArchiveRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.data.repository.findByIdOrNull

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ArchiveService(
    private val archiveRepository: ArchiveRepository
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

//    fun createArchive()


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