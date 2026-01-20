package com.sideproject.auth.controller

import com.sideproject.auth.dto.LoginResponse
import com.sideproject.auth.service.GoogleAuthService
import com.sideproject.common.dto.GoogleLoginRequest
import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.dto.TokenInfoResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class GoogleAuthController(
    private val googleAuthService: GoogleAuthService
) {

    @PostMapping("/google")
    fun googleLoginWithCode(
        @RequestBody request: GoogleLoginRequestCode
    ): LoginResponse {
        return googleAuthService.googleLoginWithCode(request.code)
    }

    @GetMapping("/token")
    fun getToken(
        @RequestParam("email") email: String
    ): TokenInfoResponse {
        return googleAuthService.getOrRefreshAccessToken(email)
    }

}
