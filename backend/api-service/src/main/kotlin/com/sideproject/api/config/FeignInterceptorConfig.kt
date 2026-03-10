package com.sideproject.api.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.sideproject.api.client.AuthServiceClient
import com.sideproject.auth.dto.AuthUser
import feign.Logger
import feign.RequestInterceptor
import feign.codec.ErrorDecoder
import org.springframework.context.annotation.Bean
import org.springframework.security.core.context.SecurityContextHolder

class FeignInterceptorConfig(private val authServiceClient: AuthServiceClient) {

    @Bean
    fun feignLoggerLevel(): Logger.Level {
        return Logger.Level.FULL // Request/Response의 모든 Header와 Body를 로그에 남김
    }

    @Bean
    fun errorDecoder(objectMapper: ObjectMapper): ErrorDecoder {
        return YoutubeErrorDecoder(objectMapper)
    }

    @Bean
    fun requestInterceptor(): RequestInterceptor {
        return RequestInterceptor { template ->
            // 현재 SecurityContext에서 인증된 사용자의 email 추출
            val authentication = SecurityContextHolder.getContext().authentication

            if (authentication != null && authentication.isAuthenticated) {
                val email = when (val principal = authentication.principal) {
                    // 1. Principal이 객체일 경우 필드에서 직접 추출
                    is AuthUser -> principal.email
                    // 2. 만약 Principal이 String(sub)으로만 저장되어 있다면 그대로 사용
                    is String -> principal
                    // 3. 그 외의 경우 (사용자 정의에 따라 다름)
                    else -> authentication.name
                }

                // auth-service를 통해 토큰 가져오기
                val tokenInfo = authServiceClient.getToken(email)
                template.header("Authorization", "Bearer ${tokenInfo.accessToken}")
            }
        }
    }

}
