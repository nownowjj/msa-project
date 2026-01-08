package com.sideproject.api.controller

import com.sideproject.common.security.PermitAll
import com.sideproject.api.security.AuthContext
import com.sideproject.common.security.AuthRequired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController {

    @GetMapping("/me")
    @AuthRequired
    fun me(): Long {
        println("controller 접근")
        return AuthContext.get().userId
    }

    @PermitAll
    @GetMapping("/health")
    fun health() = "OK"
}
