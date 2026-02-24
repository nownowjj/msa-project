package com.sideproject.auth

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@SpringBootApplication
@EnableJpaAuditing
@EnableFeignClients
class AuthApplication

fun main(args: Array<String>) {
    runApplication<AuthApplication>(*args)
}