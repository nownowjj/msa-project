plugins {
    kotlin("jvm") version "1.9.24"
}
subprojects {
    repositories {
        mavenCentral()
    }
}
dependencies {
    implementation(kotlin("stdlib-jdk8"))
}
repositories {
    mavenCentral()
}
kotlin {
    jvmToolchain(8)
}