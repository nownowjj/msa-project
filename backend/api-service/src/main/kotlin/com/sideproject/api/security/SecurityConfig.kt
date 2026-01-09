package com.sideproject.api.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain{
        http
            .csrf{it.disable()}
            .cors { } // CORS 설정은 별도 Bean에서
            .formLogin { it.disable() }
            .httpBasic { it.disable() }

            // 인증 정책
            .authorizeHttpRequests {
                it
                    .requestMatchers(
                        "/api/permitAll/**",
                        "/api/auth/login",
                        "/api/oauth/**",
                        "/api/youtube/**"
                    ).permitAll()
                    .anyRequest().authenticated()
            }

        return http.build()
    }

}