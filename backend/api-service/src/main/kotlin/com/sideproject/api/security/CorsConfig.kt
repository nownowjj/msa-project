package com.sideproject.api.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class CorsConfig(
    @Value("\${service.auth.base-url}") private val baseUrl: String
) {
    init { println(baseUrl) }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration()
        config.allowedOrigins = listOf(
            "http://localhost:5173", // 로컬
            "https://spring-archive-api.duckdns.org", // oracle Server
            "https://msa-project-steel.vercel.app" // front
        )
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH")
        config.allowedHeaders = listOf("*")
        config.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }
}