package com.sideproject.api.security

import com.fasterxml.jackson.databind.ObjectMapper
import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter
import java.nio.charset.StandardCharsets
import javax.crypto.SecretKey

class JwtTokenFilter(private val secretKey: String) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = resolveToken(request)

        try {
            if (token != null && validateToken(token)) {
                val email = getEmailFromToken(token)
                val auth = UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    listOf(SimpleGrantedAuthority("ROLE_USER"))
                )
                SecurityContextHolder.getContext().authentication = auth
            }
        } catch (e: ExpiredJwtException) {
            // 토큰 만료 시 커스텀 에러 응답 호출
            logger.error("ㅁㅇㄴㅇㅁㄴ")
            sendErrorResponse(response, "TOKEN_EXPIRED", "인증 토큰이 만료되었습니다. 다시 로그인해주세요.")
            return // 필터 체인 중단
        } catch (e: Exception) {
            // 그 외 인증 실패 (서명 불일치 등)
            sendErrorResponse(response, "INVALID_TOKEN", "유효하지 않은 토큰입니다.")
            return
        }

        filterChain.doFilter(request, response)
    }

    private fun resolveToken(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
        } else null
    }

    private fun validateToken(token: String): Boolean {
        return try {
            val claims = getClaims(token)
            !claims.expiration.before(java.util.Date())
        } catch (e: ExpiredJwtException) {
            // 만료된 경우 상위로 던짐
            logger.error("에이!@!")
            throw e
        } catch (e: Exception) {
            logger.error("Token validation error: ${e.message}")
            throw e
        }
    }

    private fun getEmailFromToken(token: String): String {
        // .subject 대신 .getSubject() 사용 가능
        return getClaims(token).subject
    }

    private fun getClaims(token: String): Claims {
        // 보안 키 생성
        val key: SecretKey = Keys.hmacShaKeyFor(secretKey.toByteArray(StandardCharsets.UTF_8))

        // 0.11.5 버전의 표준 parser 설정 방식
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body
    }

    // JSON 응답을 직접 생성하는 헬퍼 메서드
    private fun sendErrorResponse(response: HttpServletResponse, errorCode: String, message: String) {
        response.status = HttpServletResponse.SC_UNAUTHORIZED // 401
        response.contentType = "application/json;charset=UTF-8"

        val body = mapOf(
            "status" to HttpServletResponse.SC_UNAUTHORIZED,
            "code" to errorCode,
            "message" to message
        )

        val json = ObjectMapper().writeValueAsString(body)
        response.writer.write(json)
    }
}