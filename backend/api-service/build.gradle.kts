import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot")
    kotlin("jvm")
    kotlin("plugin.spring")
}

dependencies {
    // Spring Boot BOM
    implementation(platform("org.springframework.boot:spring-boot-dependencies:3.3.2"))

    implementation(project(":backend:common")) // 있다면
    implementation("org.springframework.boot:spring-boot-starter-web")

    //  WebClient 사용을 위한 필수 의존성
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation(project(mapOf("path" to ":backend:auth-service")))

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}
