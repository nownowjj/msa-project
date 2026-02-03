package com.sideproject.auth.jwt

import com.sideproject.auth.dto.AuthUser
import com.sideproject.auth.entity.User
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

    fun createAccessToken(user: User): String {
        val now = Date()

        return Jwts.builder()
            .setSubject(user.email)
            .claim("userId", user.id)
            .setIssuedAt(now)
            .setExpiration(Date(now.time + 1000 * 60 * 6000 ))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()
    }

    fun getAuthUser(token: String): AuthUser {
        val claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body

        return AuthUser(
            id = (claims["userId"] as Number).toLong(),
            email = claims.subject
        )
    }
}
