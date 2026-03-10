package com.sideproject.api.exception

import com.sideproject.api.security.UnauthorizedException
import feign.FeignException
import feign.codec.DecodeException
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

    @ExceptionHandler(YoutubeApiException::class)
    fun handleYoutubeApiException(e: YoutubeApiException): ResponseEntity<Map<String, Any>> {
        log.error("YouTube 도메인 에러 발생: status={}, reason={}, message={}", e.status, e.errorReason, e.message)

        return ResponseEntity.status(e.status).body(mapOf(
            "timestamp" to LocalDateTime.now(),
            "domain" to "YOUTUBE",
            "reason" to (e.errorReason ?: "UNKNOWN"),
            "message" to e.message,
            "status" to e.status
        ))
    }

    @ExceptionHandler(FeignException::class)
    fun handleGeneralFeignException(e: FeignException): ResponseEntity<Map<String, Any>> {
        log.error("Feign Client 상세 에러 발생: Type={}, Status={}, Message={}",
            e.javaClass.simpleName, e.status(), e.message)
        log.error("Feign Error Root Cause: ", e.cause)

        // 파싱 에러(DecodeException)인 경우 별도 처리
        if (e is DecodeException) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mapOf(
                "code" to "API_DATA_MISMATCH",
                "message" to "외부 API 응답 데이터를 처리할 수 없습니다. (DTO 구조 확인 필요)",
                "details" to (e.message ?: "")
            ))
        }

        return ResponseEntity.status(if (e.status() > 0) e.status() else 500).body(mapOf(
            "code" to "EXTERNAL_API_ERROR",
            "message" to "외부 서비스 연결 중 오류가 발생했습니다."
        ))
    }
}
