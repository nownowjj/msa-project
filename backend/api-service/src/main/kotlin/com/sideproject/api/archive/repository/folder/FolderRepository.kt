package com.sideproject.api.archive.repository.folder

import com.sideproject.api.archive.entity.Folder
import org.springframework.data.jpa.repository.JpaRepository


interface FolderRepository: JpaRepository<Folder, Long>, FolderRepositoryCustom {

}