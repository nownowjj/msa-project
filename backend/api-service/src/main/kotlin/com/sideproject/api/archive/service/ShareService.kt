package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.ArchiveResponse
import com.sideproject.api.archive.dto.ShareFolderRequest
import com.sideproject.api.archive.dto.ShareFolderResponse
import com.sideproject.api.archive.dto.SharedFolderResponse
import com.sideproject.api.archive.entity.FolderMember
import com.sideproject.api.archive.entity.FolderRole
import com.sideproject.api.archive.repository.archive.ArchiveRepository
import com.sideproject.api.archive.repository.archiveKeyword.ArchiveKeywordRepository
import com.sideproject.api.archive.repository.folder.FolderMemberRepository
import com.sideproject.api.archive.repository.folder.FolderRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.util.*

@Service
class ShareService(
    private val folderRepository: FolderRepository,
    private val archiveRepository: ArchiveRepository,
    private val archiveKeywordRepository: ArchiveKeywordRepository,
    private val folderMemberRepository: FolderMemberRepository
) {

    @Transactional
    fun generateShareLink(userId: Long, request: ShareFolderRequest): ShareFolderResponse {
        val folder = folderRepository.findById(request.folderId)
            .orElseThrow { throw IllegalArgumentException("폴더를 찾을 수 없습니다.") }

        if (folder.userId != userId) throw IllegalArgumentException("폴더 공유 권한이 없습니다.")

        // 권한별 기존 토큰 확인
        val existingToken = when (request.role) {
            FolderRole.VIEWER -> folder.viewShareToken
            FolderRole.EDITOR -> folder.editShareToken
            else -> null
        }

        // 새 토큰 생성 시 접두어 추가 (v_ 는 view, e_ 는 edit)
        val prefix = if (request.role == FolderRole.EDITOR) "e_" else "v_"
        val newToken = prefix + UUID.randomUUID().toString().replace("-", "")

        val token = existingToken ?: newToken

        // 엔티티 업데이트
        folder.enableSharing(token, request.role)

        return ShareFolderResponse(
            shareToken = token,
            shareUrl = "https://link-mint.com/s/$token",
            role = request.role
        )
    }

    @Transactional
    fun getSharedArchivesByToken(token: String, pageable: Pageable): SharedFolderResponse {
        // 1. 토큰으로 폴더 찾기 (활성화 여부 포함)
        val folder = folderRepository.findByActiveShareToken(token)
            ?: throw IllegalArgumentException("유효하지 않거나 중단된 공유 링크입니다.")

        // 2. 해당 폴더의 아카이브 페이징 조회
        val archivePage = archiveRepository.findAllByFolderIdAndUseYn(folder.id, "Y", pageable)

        if (archivePage.isEmpty) {
            return SharedFolderResponse.from(folder, folder.getRoleByToken(token)!!, Page.empty())
        }

        // 3. 기존 ArchiveService의 N+1 방지 로직 (키워드 일괄 로드)
        val archiveIds = archivePage.content.map { it.id }
        val allArchiveKeywords = archiveKeywordRepository.findAllByArchiveIdIn(archiveIds)

        val keywordMap = allArchiveKeywords.groupBy(
            { it.archive.id },
            { it.keyword.keyword }
        )

        // 4. DTO 변환 및 권한 정보 포함하여 반환
        val archiveResponses = archivePage.map { archive ->
            val keywords = keywordMap[archive.id] ?: emptyList()
            ArchiveResponse.from(archive, keywords)
        }

        return SharedFolderResponse.from(
            folder = folder,
            accessRole = folder.getRoleByToken(token)!!,
            archives = archiveResponses
        )
    }

    @Transactional
    fun autoGenerateFolderByToken(token: String, userId: Long) {
        // 1. 토큰 접두어에 따른 권한 판별
        val role = when {
            token.startsWith("e_") -> FolderRole.EDITOR
            token.startsWith("v_") -> FolderRole.VIEWER
            else -> throw IllegalArgumentException("유효하지 않은 토큰입니다.")
        }

        // 2. 토큰과 일치하는 폴더 찾기 (View 혹은 Edit 토큰 중 하나라도 일치하는 것)
        val folder = folderRepository.findByViewShareTokenOrEditShareToken(token, token)
            ?: throw IllegalArgumentException("폴더를 찾을 수 없습니다.")

        // 3. 본인이 소유자인 경우 참여 로직 스킵
        if (folder.userId == userId) return

        // 4. 이미 멤버인지 확인 (멱등성 보장)
        val isAlreadyMember = folderMemberRepository.existsByFolderIdAndUserId(folder.id!!, userId)

        if (!isAlreadyMember) {
            // 5. FolderMember 등록
            val newMember = FolderMember(
                folderId = folder.id,
                userId = userId,
                role = role
            )
            folderMemberRepository.save(newMember)
        }
    }
}