package com.sideproject.auth.service

import org.springframework.stereotype.Service

@Service
class AuthService {

    // (나중에 JPA 붙이면 됨
    fun authenticate(email: String, password: String): Pair<Long, List<String>> {
        // 임시 사용자
        if (email == "test@test.com" && password == "1234") {
            return 1L to listOf("USER")
        }
        throw IllegalArgumentException("Invalid credentials")
    }
}
