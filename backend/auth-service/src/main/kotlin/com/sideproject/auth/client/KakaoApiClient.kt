package com.sideproject.auth.client

import com.sideproject.auth.dto.KakaoUserResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader

@FeignClient(name = "kakao-api", url = "https://kapi.kakao.com")
interface KakaoApiClient {
    @GetMapping("/v2/user/me")
    fun getUserInfo(@RequestHeader("Authorization") accessToken: String): KakaoUserResponse
}