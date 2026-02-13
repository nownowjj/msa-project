import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension // 추가
import io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension // 추가

plugins {
    kotlin("jvm") version "1.9.24" apply false
    kotlin("plugin.spring") version "1.9.24" apply false
    kotlin("plugin.jpa") version "1.9.24" apply false
    kotlin("kapt") version "1.9.24" apply false
    id("org.springframework.boot") version "3.3.2" apply false
    id("io.spring.dependency-management") version "1.1.4" apply false
}

allprojects {
    group = "com.sideproject"
    version = "0.0.1"

    repositories {
        mavenCentral()
    }
}

subprojects {
    // 1. 플러그인 적용
    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "io.spring.dependency-management")

    // 2. dependencyManagement 설정 (타입 명시)
    configure<DependencyManagementExtension> {
        imports {
            mavenBom("org.springframework.cloud:spring-cloud-dependencies:2023.0.1")
        }
    }

    // 3. kotlin jvmToolchain 설정 (타입 명시)
    configure<KotlinJvmProjectExtension> {
        jvmToolchain(21)
    }

    // 4. 컴파일 옵션 설정
    tasks.withType<KotlinCompile> {
        compilerOptions {
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
        }
    }
}