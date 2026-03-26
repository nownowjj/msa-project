package com.sideproject.api.archive.dto

import com.sideproject.api.archive.entity.Folder
import com.sideproject.api.archive.entity.FolderRole
import org.springframework.data.domain.Page

data class ShareFolderRequest(
    val folderId: Long,
    val role: FolderRole // VIEWER 또는 EDITOR
)

data class ShareFolderResponse(
    val shareToken: String,
    val shareUrl: String,
    val role: FolderRole
)

data class SharedFolderResponse(
    val folderId: Long,
    val folderName: String,
    val ownerId: Long,
    val accessRole: FolderRole, // VIEWER 또는 EDITOR
    val archives: Page<ArchiveResponse>
) {
    companion object {
        fun from(folder: Folder, accessRole: FolderRole, archives: Page<ArchiveResponse>) =
            SharedFolderResponse(
                folderId = folder.id,
                folderName = folder.name,
                ownerId = folder.userId,
                accessRole = accessRole,
                archives = archives
            )
    }
}