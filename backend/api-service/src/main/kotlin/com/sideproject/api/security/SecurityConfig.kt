package com.sideproject.api.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(
    @Value("\${jwt.secret}") private val secretKey: String // application.yml의 secret key
) {

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
                        "/api/auth/**",
                    ).permitAll()
                    .anyRequest().authenticated()
            }
            // UsernamePasswordAuthenticationToken 필터 앞에 우리가 만든 JwtTokenFilter 추가
            http.addFilterBefore(
                JwtTokenFilter(secretKey),
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

}