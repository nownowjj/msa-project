package com.sideproject.auth.component

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.sideproject.auth.service.AuthProvider
import com.sideproject.auth.service.OAuthStrategy
import com.sideproject.auth.service.SocialUserInfo
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class GoogleOAuthStrategy(
    private val googleTokenVerifier: GoogleTokenVerifier,
    @Value("\${google.client-id}") private val clientId: String,
    @Value("\${google.client-secret}") private val clientSecret: String
) : OAuthStrategy {

    override fun supports(provider: String) = provider.lowercase() == "google"

    override fun login(code: String): SocialUserInfo {
        val tokens = exchangeCodeForTokens(code)
        val googleUser = googleTokenVerifier.verify(tokens.idToken)

        return SocialUserInfo(
            email = googleUser.email,
            name = googleUser.name,
            picture = googleUser.picture,
            provider = AuthProvider.GOOGLE,
            providerId = googleUser.sub,
            accessToken = tokens.accessToken,
            refreshToken = tokens.refreshToken,
            expiresIn = 3600 // 기본 1시간
        )
    }

    private fun exchangeCodeForTokens(code: String): GoogleTokens {
        val tokenResponse = GoogleAuthorizationCodeTokenRequest(
            NetHttpTransport(),
            GsonFactory.getDefaultInstance(),
            "https://oauth2.googleapis.com/token",
            clientId,
            clientSecret,
            code,
            "postmessage"
        ).execute()

        return GoogleTokens(tokenResponse.idToken, tokenResponse.accessToken, tokenResponse.refreshToken)
    }
}

data class GoogleTokens(
    val idToken: String,
    val accessToken: String,
    val refreshToken: String?
)