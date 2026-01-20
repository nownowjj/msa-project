import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm")
}

dependencies {
    implementation("jakarta.validation:jakarta.validation-api:3.1.0")
    // JPA 어노테이션 사용을 위해 필요 (@MappedSuperclass, @EntityListeners 등)
    implementation("jakarta.persistence:jakarta.persistence-api:3.1.0")

    // Spring Data JPA 사용을 위해 필요 (@CreatedDate, @LastModifiedDate 등)
    implementation("org.springframework.data:spring-data-jpa:3.2.0") // 스프링 버전과 맞춰주세요

    implementation("jakarta.validation:jakarta.validation-api:3.1.0")
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}
