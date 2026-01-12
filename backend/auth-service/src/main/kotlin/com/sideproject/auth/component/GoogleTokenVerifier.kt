package com.sideproject.auth.component

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class GoogleTokenVerifier(
    @Value("\${google.client-id}")
    private val clientId: String
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun verify(idToken: String): GoogleUser {
        val verifier = GoogleIdTokenVerifier.Builder(
            NetHttpTransport(),
            JacksonFactory.getDefaultInstance()
        )
            .setAudience(listOf(clientId))
            .build()

        val token = verifier.verify(idToken)
            ?: throw IllegalArgumentException("Invalid Google ID Token")

        val payload = token.payload
        log.info("payload : {}" , payload)

        return GoogleUser(
            sub = payload.subject,
            email = payload.email,
            name = payload["name"] as String,
            picture =  payload["picture"] as String
        )
    }
}

data class GoogleUser(
    val sub: String,   // Google user id
    val email: String,
    val name: String,
    var picture: String
)