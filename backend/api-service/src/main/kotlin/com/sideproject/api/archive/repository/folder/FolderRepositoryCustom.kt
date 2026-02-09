package com.sideproject.api.archive.repository.folder

import com.sideproject.api.archive.dto.FolderCountDto

interface FolderRepositoryCustom {

    fun findAllWithArchiveCount(userId: Long): List<FolderCountDto>
}