package com.sideproject.auth.controller

import com.sideproject.auth.dto.LoginRequest
import com.sideproject.auth.dto.LoginResponse
import com.sideproject.auth.jwt.JwtUtil
import com.sideproject.auth.service.AuthService
import com.sideproject.common.auth.AuthVerifyResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/auth")
class AuthController(
    private val jwtUtil : JwtUtil,
    private val authService: AuthService
) {


    @PostMapping("/verify")
    fun verify(@RequestHeader(HttpHeaders.AUTHORIZATION , required = false) authHeader:  String?
    ): ResponseEntity<AuthVerifyResponse> {
        if (authHeader.isNullOrBlank() || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }

        val token = authHeader.removePrefix("Bearer ").trim()

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }

        val response = AuthVerifyResponse(
            userId = jwtUtil.getUserId(token),
            roles = jwtUtil.getRoles(token)
        )

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