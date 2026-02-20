package com.sideproject.auth.controller

import com.sideproject.auth.service.GoogleAuthService
import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.dto.TokenInfoResponse
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class GoogleAuthController(
    private val googleAuthService: GoogleAuthService
) {
    private val logger = LoggerFactory.getLogger(GoogleAuthController::class.java)

    @PostMapping("/google")
    fun googleLoginWithCode(
        @RequestBody request: GoogleLoginRequestCode
    ): LoginResponse {
        logger.info("request : ${request}")
        logger.debug("request : ${request}")
        return googleAuthService.googleLoginWithCode(request.code)
    }

    @GetMapping("/token")
    fun getToken(
        @RequestParam("email") email: String
    ): TokenInfoResponse {
        return googleAuthService.getOrRefreshAccessToken(email)
    }

}
