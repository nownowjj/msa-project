package com.sideproject.api.controller

import com.sideproject.auth.dto.LoginRequest
import com.sideproject.api.client.AuthServiceClient
import com.sideproject.auth.dto.LoginResponse
import com.sideproject.common.security.PermitAll
import lombok.RequiredArgsConstructor
import lombok.extern.slf4j.Slf4j
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
class AuthController (
    private val authServiceClient: AuthServiceClient
){
    private val log = LoggerFactory.getLogger(javaClass)

    @PermitAll
    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest) : ResponseEntity<LoginResponse>{
        return try {
            val response = authServiceClient.login(request)
            log.info("auth-service login response = {}",response)
            ResponseEntity.ok(response)
        } catch (e: Exception) {
            log.error("❌ auth-service login error", e)
            throw e
        }
//        return ResponseEntity.ok(authServiceClient.login(request))
    }
}