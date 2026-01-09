package com.sideproject.api.oauth.controller

import com.sideproject.api.oauth.service.GoogleOAuthService
import com.sideproject.common.security.PermitAll
import lombok.RequiredArgsConstructor
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@PermitAll
@RestController
@RequestMapping("/api/oauth/google")
@RequiredArgsConstructor
class GoogleOAuthController(
    private val googleOAuthService: GoogleOAuthService
) {

    // 1. 프론트 → 구글 로그인 URL 요청
    @GetMapping("/login")
    fun login(): ResponseEntity<Map<String, String>> {
        val loginUrl = googleOAuthService.getLoginUrl()
        return ResponseEntity.ok(mapOf("url" to loginUrl))
    }

    // 2. 구글 → 우리 서버 콜백
    @GetMapping("/callback")
    fun callback(
        @RequestParam code: String
    ): ResponseEntity<Void> {
        googleOAuthService.handleCallback(code)

        // TODO: 프론트 페이지로 redirect
        return ResponseEntity.status(302)
            .location(URI.create("http://localhost:5173/oauth/success"))
            .build()
    }
}
