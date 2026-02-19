package com.project

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.data.jdbc.JdbcRepositoriesAutoConfiguration
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories

@EnableFeignClients(basePackages = ["com.sideproject"]) // 👈 수정
@EnableJpaRepositories(basePackages = ["com.sideproject.api", "com.sideproject.auth"]) // JPA 범위 한정
@EnableRedisRepositories(basePackages = ["com.sideproject.api"]) // Redis 범위 한정
@SpringBootApplication(
    // 1. 사용하지 않는 JDBC 자동 설정을 꺼서 메모리 절약
    exclude = [
        DataSourceTransactionManagerAutoConfiguration::class,
        JdbcRepositoriesAutoConfiguration::class
    ],
    // 2. 스캔 범위 명시
    scanBasePackages = ["com.sideproject"]
)
class MonolithApplication

fun main(args: Array<String>) {
    runApplication<MonolithApplication>(*args)
}