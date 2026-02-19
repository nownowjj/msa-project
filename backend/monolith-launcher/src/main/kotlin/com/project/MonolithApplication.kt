package com.project

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@EnableFeignClients(basePackages = ["com.sideproject"]) // 👈 수정
@SpringBootApplication(
    scanBasePackages = [
        "com.sideproject.common",
        "com.sideproject.auth",
        "com.sideproject.api"
    ]
)
class MonolithApplication

fun main(args: Array<String>) {
    runApplication<MonolithApplication>(*args)
}