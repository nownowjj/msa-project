package com.sideproject.api.exception

import com.sideproject.api.security.UnauthorizedException
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.validation.BindException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorized(ex: UnauthorizedException): ResponseEntity<ErrorResponse> {
        val errorCode = ErrorCode.UNAUTHORIZED
        return ResponseEntity
            .status(errorCode.status)
            .body(ErrorResponse.of(errorCode))
    }

    @ExceptionHandler(IllegalAccessException::class)
    fun handleForbidden(ex: IllegalAccessException): ResponseEntity<ErrorResponse> {
        val errorCode = ErrorCode.FORBIDDEN
        return ResponseEntity
            .status(errorCode.status)
            .body(ErrorResponse.of(errorCode))
    }

    @ExceptionHandler(Exception::class)
    fun handleException(ex: Exception): ResponseEntity<ErrorResponse> {
        val errorCode = ErrorCode.INTERNAL_SERVER_ERROR
        return ResponseEntity
            .status(errorCode.status)
            .body(ErrorResponse.of(errorCode))
    }

    @ExceptionHandler(BindException::class)
    fun handleBindException(e: BindException): ResponseEntity<Map<String, Any>> {
        val errors = e.bindingResult.fieldErrors.associate {
            it.field to (it.defaultMessage ?: "잘못된 값입니다")
        }
        log.error("BindException : {}" , e.bindingResult)
        return ResponseEntity.badRequest().body(
            mapOf(
                "code" to "INVALID_REQUEST",
                "errors" to errors
            )
        )
    }
}
