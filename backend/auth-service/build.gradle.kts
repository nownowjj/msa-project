import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot")
    kotlin("jvm")
    kotlin("plugin.spring")
    kotlin("plugin.jpa") version "1.9.24"
}

dependencies {
    // ⭐ Spring Boot BOM
    implementation(platform("org.springframework.boot:spring-boot-dependencies:3.3.2"))

    implementation(project(":backend:common")) // 있다면
    implementation("org.springframework.boot:spring-boot-starter-web")

    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    implementation("com.google.api-client:google-api-client:2.4.0")
    implementation("com.google.oauth-client:google-oauth-client:1.35.0")
    implementation("com.google.http-client:google-http-client-jackson2:1.43.3")
    implementation("com.google.oauth-client:google-oauth-client-jetty:1.34.1")
    implementation("com.google.apis:google-api-services-youtube:v3-rev20230816-2.0.0")

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    implementation("org.postgresql:postgresql:42.7.3")
    implementation(kotlin("stdlib-jdk8"))
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}
repositories {
    mavenCentral()
}
kotlin {
    jvmToolchain(21)
}