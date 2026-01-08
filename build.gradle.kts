plugins {
    kotlin("jvm") version "1.9.24" apply false
    kotlin("plugin.spring") version "1.9.24" apply false
    id("org.springframework.boot") version "3.3.2" apply false
}

allprojects {
    group = "com.sideproject"
    version = "0.0.1"

    repositories {
        mavenCentral()
    }
}
