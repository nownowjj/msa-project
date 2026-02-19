package com.sideproject.api.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtTokenFilter: JwtTokenFilter
) {

    init { println("SecurityConfig loaded!") }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain{
        http
            .csrf{it.disable()}
            .cors { } // CORS 설정은 별도 Bean에서
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .authorizeHttpRequests {
                it
                    .requestMatchers(
                        "/api/permitAll/**", "permitAll/**",
                        "/api/oauth/**", "oauth/**",
                        "/api/auth/**", "auth/**"
                    ).permitAll()
                    .anyRequest().authenticated()
            }
            // UsernamePasswordAuthenticationToken 필터 앞에 우리가 만든 JwtTokenFilter 추가
            .addFilterBefore(jwtTokenFilter,UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

}