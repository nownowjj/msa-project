package com.sideproject.auth.controller

import com.sideproject.auth.dto.LoginRequest
import com.sideproject.auth.dto.LoginResponse
import com.sideproject.auth.jwt.JwtUtil
import com.sideproject.auth.service.AuthService
import com.sideproject.common.auth.AuthVerifyResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(
    private val jwtUtil : JwtUtil,
    private val authService: AuthService
) {


    @PostMapping("/verify")
    fun verify(@RequestHeader(HttpHeaders.AUTHORIZATION) token: String): ResponseEntity<AuthVerifyResponse> {
        val cleanToken = token.removePrefix("Bearer ").trim()

        if (!jwtUtil.validateToken(cleanToken)) {
            return ResponseEntity.status(401).build()
        }

        val userId = jwtUtil.getUserId(cleanToken)
        val roles = jwtUtil.getRoles(cleanToken)

        val response = AuthVerifyResponse(userId, roles)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val (userId, roles) =
            authService.authenticate(request.email, request.password)

        val token = jwtUtil.generateToken(userId, roles)
        return ResponseEntity.ok(LoginResponse(token))
    }
}