//package com.sideproject.api.oauth.service
//
//import com.sideproject.api.oauth.client.GoogleOAuthClient
//import org.springframework.beans.factory.annotation.Value
//import org.springframework.stereotype.Service
//import org.springframework.web.util.UriComponentsBuilder
//
//@Service
//class GoogleOAuthService(
//    @Value("\${google.client-id}") private val clientId: String,
//    @Value("\${google.redirect-uri}") private val redirectUri: String,
//    private val googleOAuthClient: GoogleOAuthClient
//) {
//    fun getLoginUrl(): String =
//        UriComponentsBuilder
//            .fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
//            .queryParam("client_id", clientId)
//            .queryParam("redirect_uri", redirectUri)
//            .queryParam("response_type", "code")
//            .queryParam("scope", "https://www.googleapis.com/auth/youtube.readonly")
//            .queryParam("access_type", "offline")
//            .queryParam("prompt", "consent")
//            .build()
//            .toUriString()
//
//    fun handleCallback(code: String) {
//        val token = googleOAuthClient.getToken(code)
//
////        val userInfo = googleOAuthClient.getUserInfo(token.accessToken)
//
////        println("googleUserId = ${userInfo.id}")
////        println("email = ${userInfo.email}")
//    }
//}
