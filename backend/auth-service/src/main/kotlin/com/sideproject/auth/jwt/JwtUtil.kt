package com.sideproject.auth.jwt

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.Claims
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*

@Component
class JwtUtil {

    // 테스트용 시크릿 (실무에서는 환경변수/Secret 관리)
    private val secret = "mysupersecretkeymysupersecretkey" // 최소 256bit 이상
    private val key = Keys.hmacShaKeyFor(secret.toByteArray())

    fun parseToken(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body
    }

    fun validateToken(token: String): Boolean {
        return try {
            parseToken(token)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getUserId(token: String): Long {
        val claims = parseToken(token)
        return claims["userId"].toString().toLong()
    }

    fun getRoles(token: String): List<String> {
        val claims = parseToken(token)
        val roles = claims["roles"]
        return if (roles is List<*>) roles.filterIsInstance<String>() else emptyList()
    }

    // Jwt Token 발급
    fun generateToken(
        userId: Long,
        roles: List<String>
    ): String {
        val now = Date()
        val expiry = Date(now.time + 1000 * 60 * 60) // 1시간

        return Jwts.builder()
            .claim("userId", userId)
            .claim("roles", roles)
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(key)
            .compact()
    }
}
