package com.sideproject.api.oauth.controller

import com.sideproject.api.archive.service.FolderService
import com.sideproject.api.client.AuthServiceClient
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.dto.OAuthCodeRequest
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class OAuthController (
    private val authServiceClient: AuthServiceClient,
    private val folderService: FolderService,
){
    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/login/{provider}")
    fun socialLogin(
        @PathVariable provider: String,
        @RequestBody request: OAuthCodeRequest
    ): LoginResponse {
        // auth-service로 provider 정보와 함께 전달
        val response = authServiceClient.socialLogin(provider, request.code)

        if (response.isNewUser) {
            handleNewUser(response.userId)
        }

        return response
    }

    private fun handleNewUser(userId: Long) {
        try {
            folderService.createDefaultFolderForJoin(userId)
        } catch (e: Exception) {
            log.error("회원가입 시 기본 폴더 생성 실패 (userId: $userId): ${e.message}")
        }
    }
}