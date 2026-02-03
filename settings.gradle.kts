plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.5.0"
}
rootProject.name = "msa-project"

include(
    "backend:common",
    "backend:auth-service",
    "backend:api-service"
//    "backend:gateway-service"
)
//include("common")
//include("auth-service")
//include("api-service")
