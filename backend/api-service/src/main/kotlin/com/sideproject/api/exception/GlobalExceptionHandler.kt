package com.sideproject.api.exception

import com.sideproject.api.security.UnauthorizedException
import feign.FeignException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.BindException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime

@RestControllerAdvice
class GlobalExceptionHandler {
    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorized(ex: UnauthorizedException): ResponseEntity<ErrorResponse> {
        val errorCode = ErrorCode.UNAUTHORIZED
        log.error("errorCode = ${errorCode},${ex.printStackTrace()}")
        return ResponseEntity
            .status(errorCode.status)
            .body(ErrorResponse.of(errorCode))
    }

    @ExceptionHandler(IllegalAccessException::class)
    fun handleForbidden(ex: IllegalAccessException): ResponseEntity<ErrorResponse> {
        val errorCode = ErrorCode.FORBIDDEN
        log.error("errorCode = ${errorCode},${ex.printStackTrace()}")
        return ResponseEntity
            .status(errorCode.status)
            .body(ErrorResponse.of(errorCode))
    }

    @ExceptionHandler(Exception::class)
    fun handleException(ex: Exception): ResponseEntity<ErrorResponse> {
        val errorCode = ErrorCode.INTERNAL_SERVER_ERROR

        log.error("errorCode = ${errorCode},${ex.printStackTrace()}")

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

    @ExceptionHandler(FeignException::class)
    fun handleFeignException(e: FeignException): ResponseEntity<Map<String, Any>> {
        log.error("Feign Client Error: status={}, message={}", e.status(), e.contentUTF8())

        val status = HttpStatus.valueOf(if (e.status() > 0) e.status() else 500)
        return ResponseEntity.status(status).body(mapOf(
            "timestamp" to LocalDateTime.now(),
            "status" to status.value(),
            "error" to "YouTube API 호출 중 오류가 발생했습니다.",
            "details" to e.contentUTF8()
        ))
    }
}
