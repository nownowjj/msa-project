import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot")
    kotlin("jvm") version "1.9.24" // 예시: 현재 프로젝트의 Kotlin 버전
    kotlin("plugin.spring") version "1.9.24"
    kotlin("plugin.jpa") version "1.9.24"

    kotlin("kapt")
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

    implementation("org.springframework.boot:spring-boot-starter-validation")

    implementation ("org.springframework.boot:spring-boot-starter-oauth2-client")

    implementation("org.postgresql:postgresql:42.7.3")

    implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa") // JPA 쓰면 추가

    implementation("org.springframework.cloud:spring-cloud-starter-openfeign")

    // Spring Security
    implementation("org.springframework.boot:spring-boot-starter-security")

    // JJWT
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

    // HTML 파싱용
    implementation("org.jsoup:jsoup:1.17.2")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")

    implementation("org.springframework.boot:spring-boot-starter-test")
    implementation(kotlin("stdlib-jdk8"))

// Querydsl
    implementation("com.querydsl:querydsl-jpa:5.0.0:jakarta")

    // 이제 'kapt'가 빨간 줄 없이 인식될 겁니다.
    kapt("com.querydsl:querydsl-apt:5.0.0:jakarta")

    // Jakarta 관련 설정 (Spring Boot 3.x 기준 필수)
    kapt("jakarta.annotation:jakarta.annotation-api")
    kapt("jakarta.persistence:jakarta.persistence-api")
}

// 5. QClass 생성 경로 설정 및 IDE 연동
// 이 설정을 해야 빌드 시 생성된 코드를 IntelliJ가 소스 코드로 인식합니다.
kapt {
    keepJavacAnnotationProcessors = true
}

// 빌드 결과물(build/...)에 QClass가 생성되도록 하여
// 소스 코드 관리(Git)에 포함되지 않으면서도 빌드 시에는 참조 가능하게 합니다.
sourceSets {
    main {
        kotlin.srcDir("build/generated/source/kapt/main")
    }
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}

tasks.test {
    useJUnitPlatform()
    testLogging {
        showStandardStreams = true
        events("passed", "skipped", "failed")
    }
}

repositories {
    mavenCentral()
}
kotlin {
    jvmToolchain(21)
}