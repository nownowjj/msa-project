package com.project

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@EnableFeignClients(basePackages = ["com.project"]) // Feign 스캔 범위 지정
@SpringBootApplication(
    scanBasePackages = [
        "com.project.common",
        "com.project.auth",
        "com.project.api"
    ]
)
class MonolithApplication

fun main(args: Array<String>) {
    runApplication<MonolithApplication>(*args)
}