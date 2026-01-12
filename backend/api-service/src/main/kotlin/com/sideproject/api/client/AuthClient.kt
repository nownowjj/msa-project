package com.sideproject.api.client


import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.auth.AuthVerifyResponse
import com.sideproject.common.dto.LoginResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader

@FeignClient(
    name = "auth-service",
    url = "\${service.auth.base-url}" // application.yml
)
interface AuthClient {

    @PostMapping("/auth/verify")
    fun verify(
        @RequestHeader("Authorization") token: String
    ): AuthVerifyResponse

//    @PostMapping("/auth/login")
//    fun login(
//        @RequestBody request: LoginRequest
//    ): LoginResponse

    // ⭐ Google Login
//    @PostMapping("/auth/google")
//    fun googleLogin(
//        @RequestBody request: GoogleLoginRequest
//    ): LoginResponse

    // ⭐ Google Login with code
    @PostMapping("/auth/google")
    fun googleLoginWithCode(
        @RequestBody request: GoogleLoginRequestCode
    ): LoginResponse
}
