package com.sideproject.api.config

import com.sideproject.api.client.AuthServiceClient
import feign.RequestInterceptor
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.core.context.SecurityContextHolder

//@Configuration
class FeignInterceptorConfig(private val authServiceClient: AuthServiceClient) {

    @Bean
    fun requestInterceptor(): RequestInterceptor {
        return RequestInterceptor { template ->
            // 현재 SecurityContext에서 인증된 사용자의 email 추출
            val authentication = SecurityContextHolder.getContext().authentication
            if (authentication != null && authentication.isAuthenticated) {
                val email = authentication.name

                // auth-service를 통해 토큰 가져오기
                val tokenInfo = authServiceClient.getToken(email)
                template.header("Authorization", "Bearer ${tokenInfo.accessToken}")
            }
        }
    }
}