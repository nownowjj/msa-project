package com.sideproject.api.security

class ForbiddenException(
    message: String = "Forbidden"
) : RuntimeException(message)
