package com.sideproject.api.client

import com.sideproject.api.security.UnauthorizedException
import com.sideproject.auth.dto.LoginRequest
import com.sideproject.auth.dto.LoginResponse
import com.sideproject.common.auth.AuthVerifyResponse
import org.springframework.http.HttpHeaders
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import reactor.util.retry.Retry
import java.time.Duration

@Component
class AuthServiceClient(
    private val authWebClient: WebClient
) {

    fun verify(token: String): AuthVerifyResponse {
        return authWebClient
            .post()
            .uri("/auth/verify")
            .header(HttpHeaders.AUTHORIZATION, token)
            .retrieve()
            .onStatus({ it.is4xxClientError }) {
                Mono.error(UnauthorizedException())
            }
            .onStatus({ it.is5xxServerError }) {
                Mono.error(RuntimeException("Auth service error"))
            }
            // ⭐ Retry 정책: 실패 시 최대 3번 재시도, 500ms 간격
            .bodyToMono(AuthVerifyResponse::class.java)
            .retryWhen(
                Retry.backoff(3, Duration.ofMillis(500))
                    .filter { it !is UnauthorizedException } // 인증 실패는 재시도하지 않음
            )
            .block()!!
    }

    fun login(request: LoginRequest): LoginResponse =
        authWebClient.post()
            .uri("/auth/login")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(LoginResponse::class.java)
            .block()
            ?: throw IllegalStateException("Auth login response is null")
}
