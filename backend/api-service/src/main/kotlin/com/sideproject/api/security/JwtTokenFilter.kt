package com.sideproject.api.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.sideproject.auth.jwt.JwtProvider
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
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.nio.charset.StandardCharsets
import javax.crypto.SecretKey

@Component
class JwtTokenFilter(
    private val jwtVerifier: JwtVerifier
) : OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val path = request.requestURI
        return path.startsWith("/api/auth/")
                || path.startsWith("/api/oauth/")
                || path.startsWith("/api/permitAll/")
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = resolveToken(request)

        try {
            if (token != null) {
                val user = jwtVerifier.verify(token)

                val auth = UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    listOf(SimpleGrantedAuthority("ROLE_USER"))
                )

                SecurityContextHolder.getContext().authentication = auth
            }
        } catch (e: ExpiredJwtException) {
            sendErrorResponse(response, "TOKEN_EXPIRED", "토큰 만료")
            return
        } catch (e: Exception) {
            sendErrorResponse(response, "INVALID_TOKEN", "유효하지 않은 토큰")
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