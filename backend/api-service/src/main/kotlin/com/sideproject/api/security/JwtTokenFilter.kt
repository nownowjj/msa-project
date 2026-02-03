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

//    private fun validateToken(token: String): Boolean {
//        return try {
//            val claims = getClaims(token)
//            !claims.expiration.before(java.util.Date())
//        } catch (e: ExpiredJwtException) {
//            // 만료된 경우 상위로 던짐
//            logger.error("에이!@!")
//            throw e
//        } catch (e: Exception) {
//            logger.error("Token validation error: ${e.message}")
//            throw e
//        }
//    }

//    private fun getEmailFromToken(token: String): String {
//        // .subject 대신 .getSubject() 사용 가능
//        return getClaims(token).subject
//    }

//    private fun getClaims(token: String): Claims {
//        // 보안 키 생성
//        val key: SecretKey = Keys.hmacShaKeyFor(secretKey.toByteArray(StandardCharsets.UTF_8))
//
//        // 0.11.5 버전의 표준 parser 설정 방식
//        return Jwts.parserBuilder()
//            .setSigningKey(key)
//            .build()
//            .parseClaimsJws(token)
//            .body
//    }

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