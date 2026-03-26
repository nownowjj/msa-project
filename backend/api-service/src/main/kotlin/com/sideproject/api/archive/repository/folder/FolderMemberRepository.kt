package com.sideproject.api.archive.repository.folder

import com.sideproject.api.archive.entity.FolderMember
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FolderMemberRepository : JpaRepository<FolderMember, Long> {

    // ✅ 1. 특정 폴더에 특정 사용자가 이미 참여 중인지 확인 (멱등성 체크용)
    fun existsByFolderIdAndUserId(folderId: Long, userId: Long): Boolean

    // ✅ 2. 사용자가 참여 중인 모든 폴더 멤버 정보 조회 (권한 포함)
    fun findAllByUserId(userId: Long): List<FolderMember>

    // ✅ 3. 특정 폴더의 모든 멤버 조회 (공유 관리 페이지 등에서 사용)
    fun findAllByFolderId(folderId: Long): List<FolderMember>

    // ✅ 4. 특정 사용자의 특정 폴더 참여 정보 단건 조회
    fun findByFolderIdAndUserId(folderId: Long, userId: Long): FolderMember?

    // ✅ 5. 참여 취소 (폴더 나가기)
    fun deleteByFolderIdAndUserId(folderId: Long, userId: Long)

}