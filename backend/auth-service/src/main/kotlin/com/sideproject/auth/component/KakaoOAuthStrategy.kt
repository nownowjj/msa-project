package com.sideproject.auth.component

import com.sideproject.auth.client.KakaoApiClient
import com.sideproject.auth.client.KakaoAuthClient
import com.sideproject.auth.service.AuthProvider
import com.sideproject.auth.service.OAuthStrategy
import com.sideproject.auth.service.SocialUserInfo
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class KakaoOAuthStrategy(
    private val kakaoAuthClient: KakaoAuthClient,
    private val kakaoApiClient: KakaoApiClient,
    @Value("\${kakao.client-id}") private val clientId: String,
    @Value("\${kakao.client-secret}") private val clientSecret: String,
    @Value("\${kakao.redirect-uri}") private val redirectUri: String
) : OAuthStrategy {

    override fun supports(provider: String) = provider.lowercase() == "kakao"

    override fun login(code: String): SocialUserInfo {
        // 1. 인가 코드로 엑세스 토큰 요청
        val tokenResponse = kakaoAuthClient.getToken(
            clientId = clientId,
            redirectUri = redirectUri,
            code = code,
            clientSecret = clientSecret
        )

        // 2. 토큰으로 사용자 정보 요청
        val kakaoUser = kakaoApiClient.getUserInfo("Bearer ${tokenResponse.accessToken}")

        // 3. 공통 규격(SocialUserInfo)으로 변환
        // 구글 필드가 아니므로 providerId와 공통 정보만 담음
        return SocialUserInfo(
            // 이메일이 없을 경우를 대비해 id를 활용한 더미 이메일 혹은 예외 처리가 필요할 수 있음
            email = kakaoUser.kakaoAccount.email ?: "${kakaoUser.id}@kakao.com",

            // 이름과 사진은 properties 혹은 kakaoAccount.profile 중 값이 있는 쪽을 선택
            name = kakaoUser.properties.nickname,
            picture = kakaoUser.properties.profileImage,

            provider = AuthProvider.KAKAO,
            providerId = kakaoUser.id.toString(), // 카카오 ID는 Long이므로 String 변환
            accessToken = tokenResponse.accessToken,
            refreshToken = tokenResponse.refreshToken,
            expiresIn = tokenResponse.expiresIn
        )
    }
}