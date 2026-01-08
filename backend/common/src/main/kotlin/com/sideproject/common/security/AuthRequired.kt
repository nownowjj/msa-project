package com.sideproject.common.security

@Target(
    AnnotationTarget.FUNCTION,
    AnnotationTarget.CLASS
)
@Retention(AnnotationRetention.RUNTIME)
annotation class AuthRequired(
    val role: String = "USER"
)