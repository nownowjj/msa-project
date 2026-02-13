import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") // 버전 제거 또는 부모와 동일하게
    id("io.spring.dependency-management")
    kotlin("jvm")
    kotlin("plugin.spring")
    kotlin("plugin.jpa")
    kotlin("kapt") // 👈 여기서 version "1.9.24"를 지웁니다.
}

dependencies {
    // 1. 하위 모듈 의존성 추가
    implementation(project(":backend:common"))
    implementation(project(":backend:auth-service"))
    implementation(project(":backend:api-service"))

    // 2. 런타임에 필요한 핵심 라이브러리 (버전은 BOM에 의해 관리됨)
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.cloud:spring-cloud-starter-openfeign")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    // 3. 데이터베이스 및 인프라
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")

    // 4. QueryDSL (api-service의 QClass 참조를 위해 필요)
    implementation("com.querydsl:querydsl-jpa:5.0.0:jakarta")
    kapt("com.querydsl:querydsl-apt:5.0.0:jakarta")
    kapt("jakarta.annotation:jakarta.annotation-api")
    kapt("jakarta.persistence:jakarta.persistence-api")
}

// 빌드 최적화: app.jar 하나만 생성하도록 설정
tasks.getByName<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    archiveFileName.set("app.jar")
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}

kotlin {
    jvmToolchain(21)
}

repositories {
    mavenCentral()
}