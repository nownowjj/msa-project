package com.sideproject.api.oauth.controller

import com.sideproject.api.archive.service.FolderService
import com.sideproject.api.client.AuthServiceClient
import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.security.PermitAll
import lombok.RequiredArgsConstructor
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@PermitAll
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
class GoogleOAuthController(
    private val authServiceClient: AuthServiceClient,
    private val folderService: FolderService,
) {
    private val log = LoggerFactory.getLogger(GoogleOAuthController::class.java)

    // Google -> React에서 받은 code
    @PostMapping("/google")
    fun googleLoginWithCode(
        @RequestBody request: GoogleLoginRequestCode
    ): LoginResponse {
        val response = authServiceClient.googleLoginWithCode(request.code)

        // 2. 신규 유저인 경우 기본 폴더 생성 시도
        if (response.isNewUser) {
            try {
                // 별도의 트랜잭션(REQUIRES_NEW)에서 실행됨
                folderService.createDefaultFolderForJoin(response.userId)
            } catch (e: Exception) {
                // 폴더 생성 실패가 로그인을 막지 않도록 로그만 남김
                log.error("회원가입 시 기본 폴더 생성 실패 (userId: ${response.userId}): ${e.message}")
            }
        }

        return response
    }
}
