package com.sideproject.auth.client

import com.sideproject.auth.dto.KakaoTokenResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(name = "kakao-auth", url = "https://kauth.kakao.com")
interface KakaoAuthClient {
    @PostMapping("/oauth/token", consumes = ["application/x-www-form-urlencoded"])
    fun getToken(
        @RequestParam("grant_type") grantType: String = "authorization_code",
        @RequestParam("client_id") clientId: String,
        @RequestParam("redirect_uri") redirectUri: String,
        @RequestParam("code") code: String,
        @RequestParam("client_secret") clientSecret: String
    ): KakaoTokenResponse
}