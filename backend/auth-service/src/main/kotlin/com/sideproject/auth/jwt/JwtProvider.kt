package com.sideproject.auth.jwt

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date

@Component
class JwtProvider(
    @Value("\${jwt.secret}")
    private val secret: String
) {
    private val key = Keys.hmacShaKeyFor(secret.toByteArray())

    fun createAccessToken(email: String): String {
        val claims = Jwts.claims().setSubject(email)
        val now = Date()
        val validity = Date(now.time + 3600 * 10)

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 60))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()
    }
}
