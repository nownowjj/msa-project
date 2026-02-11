package com.sideproject.api.archive.service

import com.sideproject.api.archive.dto.FolderCreateRequest
import com.sideproject.api.archive.dto.FolderTreeResponse
import com.sideproject.api.archive.dto.FolderUpdateRequest
import com.sideproject.api.archive.entity.Folder
import com.sideproject.api.archive.repository.archive.ArchiveRepository
import com.sideproject.api.archive.repository.archiveKeyword.ArchiveKeywordRepository
import com.sideproject.api.archive.repository.folder.FolderRepository
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class FolderService (
    private val folderRepository: FolderRepository,
    private val archiveKeywordRepository: ArchiveKeywordRepository,
    private val archiveRepository: ArchiveRepository
){
    private val logger = LoggerFactory.getLogger(FolderService::class.java)

    @Transactional
    fun getFolders(userId: Long): List<FolderTreeResponse> {
        // 1. DB 조회 (평면 구조)
        val folderDtos = folderRepository.findAllWithArchiveCount(userId)

        // 2. Response DTO로 변환 및 Map에 저장 (빠른 조회를 위해)
        val allFolders = folderDtos.map { dto ->
            FolderTreeResponse(
                id = dto.folder.id,
                name = dto.folder.name,
                depth = dto.folder.depth,
                parentId = dto.folder.parentId,
                sortOrder = dto.folder.sortOrder,
                archiveCount = dto.archiveCount
            )
        }

        val folderMap = allFolders.associateBy { it.id }
        val rootFolders = mutableListOf<FolderTreeResponse>()

        // 3. 트리 구조 조립
        allFolders.forEach { folder ->
            if (folder.parentId == null) {
                rootFolders.add(folder)
            } else {
                folderMap[folder.parentId]?.children?.add(folder)
            }
        }

        // 4. 각 계층별 sortOrder 정렬 (필요 시)
        rootFolders.forEach { sortRecursive(it) }
        return rootFolders.sortedBy { it.sortOrder }
    }

    private fun sortRecursive(folder: FolderTreeResponse) {
        folder.children.sortBy { it.sortOrder }
        folder.children.forEach { sortRecursive(it) }
    }

    /** 생성 로직 */
    fun createFolder(userId: Long, request: FolderCreateRequest): Long {
        // 1. 부모 폴더 존재 여부 및 소유권 확인
        val parent = request.parentId?.let {
            folderRepository.findByIdAndUserId(it, userId)
                ?: throw IllegalArgumentException("부모 폴더를 찾을 수 없거나 접근 권한이 없습니다.")
        }

        // 2. 최대 Depth 제한 (선택 사항: 현재 기획에 따라 0~2 또는 1~3)
        if (parent != null && parent.depth > 2) { // 0(최상위), 1(하위), 2(최하위) 구조라면
            throw IllegalStateException("더 이상 하위 폴더를 생성할 수 없습니다.")
        }

        // 3. 해당 위치(부모 아래)의 마지막 sortOrder 가져오기 (기본값 0)
        val nextSortOrder = folderRepository.findMaxSortOrder(userId, request.parentId) + 1

        val newFolder = Folder(
            name = request.name,
            userId = userId,
            parentId = parent?.id,
            depth = if (parent == null) 0 else parent.depth + 1,
            sortOrder = nextSortOrder
        )
        return folderRepository.save(newFolder).id
    }

    //상태 변경: folder.parentId = newParent?.id를 호출하는 순간, 이 폴더는 메모리 상에서 이미 "이동할 위치"에 가 있습니다.
    //
    //Flush 발생: folderRepository.findMaxSortOrder(...)는 QueryDSL/JPQL 쿼리입니다. JPA는 SELECT 쿼리를 날리기 전에 데이터 정합성을 위해 **메모리의 변경 사항을 DB에 미리 반영(Flush)**합니다.
    /** 수정 로직 (중요: 계층 이동 포함) */
    @Transactional
    fun updateFolder(userId: Long, folderId: Long, request: FolderUpdateRequest) {
        val folder = folderRepository.findByIdAndUserId(folderId, userId)
            ?: throw IllegalArgumentException("폴더를 찾을 수 없습니다.")

        // 1. 이름 수정
        request.name?.let { folder.updateName(it) }

        // 2. 부모 폴더 변경 (위치 이동 로직)
        if (request.parentId != folder.parentId) {

            // [검증] 기본 폴더(sortOrder 0)는 이동 불가
            if (folder.sortOrder == 0 && folder.depth == 0) {
                throw IllegalStateException("기본 폴더는 위치를 변경할 수 없습니다.")
            }

            val newParent = request.parentId?.let {
                // [검증] 자기 자신으로 이동 불가
                if (it == folderId) throw IllegalArgumentException("자기 자신으로 이동할 수 없습니다.")

                // [검증] 자식 폴더로 이동 불가 (순환 참조 방지)
                if (isChildFolder(folderId, it)) {
                    throw IllegalArgumentException("자식 폴더로 이동할 수 없습니다.")
                }

                folderRepository.findByIdAndUserId(it, userId) ?: throw Exception("상위 폴더 없음")
            }

            // ✅ [해결책] 정보를 업데이트하기 전에 MAX 값을 먼저 가져옵니다.
            // 이때 DB에는 아직 이 폴더가 '이전 위치'에 있으므로 나를 제외한 순수 MAX값이 나옵니다.
            val nextSortOrder = folderRepository.findMaxSortOrder(userId, request.parentId) + 1

            // [이동 처리] 새 부모에 따른 depth 계산 및 필드 업데이트
            val oldDepth = folder.depth
            val newDepth = if (newParent == null) 0 else newParent.depth + 1

            // [검증] 이동 후 최대 depth 제한 (예: 3단계까지만 허용)
            if (newDepth > 3) throw IllegalStateException("최대 계층(3단계)을 초과할 수 없습니다.")

            // 본인 정보 업데이트
            folder.parentId = newParent?.id
            folder.depth = newDepth
            folder.sortOrder = nextSortOrder


            // 3. 자식 폴더들의 depth 연쇄 업데이트 (depth 차이만큼 가감)
            if (oldDepth != newDepth) {
                updateChildrenDepth(folderId, newDepth - oldDepth)
            }
        }
    }

    /** 자식 폴더 여부를 재귀적으로 확인 (순환 참조 방지용) */
    private fun isChildFolder(parentId: Long, targetId: Long): Boolean {
        val children = folderRepository.findAllByParentId(parentId)
        for (child in children) {
            if (child.id == targetId || isChildFolder(child.id, targetId)) return true
        }
        return false
    }

    /** 자식들의 depth를 일괄 업데이트 */
    private fun updateChildrenDepth(parentId: Long, depthDelta: Int) {
        val children = folderRepository.findAllByParentId(parentId)
        children.forEach { child ->
            child.depth += depthDelta
            updateChildrenDepth(child.id, depthDelta) // 재귀 호출
        }
    }

    /** 삭제 로직 */
    @Transactional
    fun deleteFolder(userId: Long, folderId: Long) {
        // 1. 기본 폴더 보호 및 권한 확인
        val folder = folderRepository.findByIdAndUserId(folderId, userId)
            ?: throw IllegalArgumentException("폴더를 찾을 수 없거나 접근 권한이 없습니다.")

        // 기본 폴더(최상위이면서 정렬순서 0)는 시스템 유지를 위해 삭제 제한
        if (folder.depth == 0 && folder.sortOrder == 0) {
            throw IllegalStateException("기본 폴더는 삭제할 수 없습니다.")
        }

        // 2. CTE를 활용하여 자신을 포함한 모든 하위 폴더 ID 리스트 조회 (쿼리 1회)
        val allFolderIds = folderRepository.findAllChildIdsRecursive(folderId, userId)

        if (allFolderIds.isNotEmpty()) {

            // (1) 해당 폴더들에 속한 아카이브들의 키워드 매핑 제거
            // ArchiveKeyword -> Archive 참조 관계이므로 먼저 삭제
            // soft Delete 정책을 사용 할거라 물리적 삭제는 하지 않는다(남겨놓자)
//            archiveKeywordRepository.deleteByFolderIds(allFolderIds)

            // (2) 해당 폴더들에 속한 아카이브 본체 제거 (논리적으로만 삭제하자)
            archiveRepository.softDeleteByFolderIds(allFolderIds)

            // (3) 폴더 본체들 제거 (모든 폴더 ID를 한꺼번에 삭제) (물리적 삭제하자)
            folderRepository.deleteAllByIdIn(allFolderIds)
        }
    }
}