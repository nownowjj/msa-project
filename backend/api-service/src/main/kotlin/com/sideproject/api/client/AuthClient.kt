package com.sideproject.api.client


import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.auth.AuthVerifyResponse
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.dto.TokenInfoResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(
    name = "auth-service",
    url = "\${service.auth.base-url}" // application.yml
)
interface AuthClient {

    @PostMapping("/auth/verify")
    fun verify(
        @RequestHeader("Authorization") token: String
    ): AuthVerifyResponse


    // ⭐ Google Login with code
    @PostMapping("/auth/google")
    fun googleLoginWithCode(
        @RequestBody request: GoogleLoginRequestCode
    ): LoginResponse

    @GetMapping("/auth/token")
    fun getToken(@RequestParam("email") email: String): TokenInfoResponse
}
