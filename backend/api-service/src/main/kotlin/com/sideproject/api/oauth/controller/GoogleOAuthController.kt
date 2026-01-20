package com.sideproject.api.oauth.controller

import com.sideproject.api.client.AuthServiceClient
import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.security.PermitAll
import lombok.RequiredArgsConstructor
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@PermitAll
@RestController
@RequestMapping("/api/auth")
//@RequestMapping("/api/oauth/google")
@RequiredArgsConstructor
class GoogleOAuthController(
    private val authServiceClient: AuthServiceClient
) {

    // Google -> React에서 받은 code
    @PostMapping("/google")
    fun googleLoginWithCode(
        @RequestBody request: GoogleLoginRequestCode
    ): LoginResponse {
        return authServiceClient.googleLoginWithCode(request.code)
    }
}
