package com.sideproject.api.security

import com.sideproject.auth.dto.AuthUser
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import javax.crypto.SecretKey

@Component
class JwtVerifier(
    @Value("\${jwt.secret}") secret: String
) {
    private val key: SecretKey =
        Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8))

    fun verify(token: String): AuthUser {
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
