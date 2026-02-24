package com.sideproject.auth.controller

import com.sideproject.auth.service.AuthService
import com.sideproject.common.dto.LoginResponse
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService
) {
    private val logger = LoggerFactory.getLogger(AuthController::class.java)

    @PostMapping("/login/{provider}")
    fun socialLogin(
        @PathVariable provider: String,
        @RequestBody code: String // JSON의 code 필드만 파싱됨
    ): LoginResponse {
        logger.info("Social Login Request - Provider: $provider")
        return authService.processSocialLogin(provider, code)
    }
}