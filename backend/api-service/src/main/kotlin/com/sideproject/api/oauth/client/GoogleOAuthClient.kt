//package com.sideproject.api.oauth.client
//
//import com.fasterxml.jackson.databind.ObjectMapper
//import com.sideproject.api.oauth.dto.GoogleTokenErrorResponse
//import com.sideproject.api.oauth.dto.GoogleTokenResponse
//import com.sideproject.api.oauth.dto.GoogleUserInfo
//import org.slf4j.LoggerFactory
//import org.springframework.beans.factory.annotation.Value
//import org.springframework.http.HttpHeaders
//import org.springframework.http.MediaType
//import org.springframework.stereotype.Service
//import org.springframework.web.reactive.function.BodyInserters
//import org.springframework.web.reactive.function.client.WebClient
//import java.lang.reflect.InvocationTargetException
//
//@Service
//class GoogleOAuthClient(
//    private val webClient: WebClient,
//    @Value("\${google.client-id}") private val clientId: String,
//    @Value("\${google.client-secret}") private val clientSecret: String,
//    @Value("\${google.redirect-uri}") private val redirectUri: String
//) {
//    private val log = LoggerFactory.getLogger(javaClass)
//
//    fun getToken(code: String): GoogleTokenResponse {
//        val raw = webClient.post()
//            .uri("https://oauth2.googleapis.com/token")
//            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
//            .body(
//                BodyInserters.fromFormData("code", code)
//                    .with("client_id", clientId)
//                    .with("client_secret", clientSecret)
//                    .with("redirect_uri", redirectUri)
//                    .with("grant_type", "authorization_code")
//            )
//            .retrieve()
//            .bodyToMono(String::class.java)
//            .block()!!
//
//        log.info("🔵 Google token raw response = $raw")
//
//        val mapper = ObjectMapper()
//        val node = mapper.readTree(raw)
//
//        // 🔴 Google OAuth 에러 응답
//        if (node.has("error")) {
//            val error = mapper.treeToValue(node, GoogleTokenErrorResponse::class.java)
//            throw RuntimeException(
//                "Google OAuth token error: ${error.error} / ${error.error_description}"
//            )
//        }
//
//        // ✅ 정상 토큰 응답
////        return mapper.treeToValue(node, GoogleTokenResponse::class.java)
//        try {
//            return mapper.treeToValue(node, GoogleTokenResponse::class.java)
//        } catch (e: Exception) {
//            log.error("🔥 GoogleTokenResponse 매핑 실패")
//            log.error("🔥 raw json = {}", node.toPrettyString())
//
//            if (e is InvocationTargetException) {
//                log.error("🔥 targetException", e.targetException)
//            } else {
//                log.error("🔥 exception", e)
//            }
//
//            throw e
//        }
//    }
//
//    fun getUserInfo(accessToken: String): GoogleUserInfo =
//        webClient.get()
//            .uri("https://www.googleapis.com/oauth2/v2/userinfo")
//            .header(HttpHeaders.AUTHORIZATION, "Bearer $accessToken")
//            .retrieve()
//            .bodyToMono(GoogleUserInfo::class.java)
//            .doOnError { e ->
//                log.error("🔥 Google OAuth getUserInfo API 호출 중 예외 발생", e)
//            }
//            .block()!!
//
//}
