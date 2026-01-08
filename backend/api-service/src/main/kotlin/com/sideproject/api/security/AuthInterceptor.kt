package com.sideproject.api.security

import com.sideproject.api.client.AuthServiceClient
import com.sideproject.common.security.AuthRequired
import com.sideproject.common.security.PermitAll
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import lombok.extern.slf4j.Slf4j
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor

@Slf4j
@Component
class AuthInterceptor(
    private val authServiceClient: AuthServiceClient
) : HandlerInterceptor {

    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any
    ): Boolean {

        if (handler !is HandlerMethod) return true

        // PermitAll → 무조건 통과
        if (
            handler.hasMethodAnnotation(PermitAll::class.java) ||
            handler.beanType.isAnnotationPresent(PermitAll::class.java)
        ) return true

        // 2. 기본 정책 = 인증 필요
        val token = request.getHeader("Authorization")
            ?: throw UnauthorizedException("Authorization header missing")

        val authResult = authServiceClient.verify(token)

        // 3. com.sideproject.common.security.AuthRequired role 검사 (있을 경우만)
        findAuthRequired(handler)?.let { required ->
            if (!authResult.roles.contains(required.role)) {
                throw ForbiddenException()
            }
        }

        // 4. 인증 정보 저장
        AuthContext.set(authResult)

        return true
    }

    override fun afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        ex: Exception?
    ) {
        AuthContext.clear()
    }

    private fun isPermitAll(handler: HandlerMethod): Boolean =
        handler.hasMethodAnnotation(PermitAll::class.java) ||
                handler.beanType.isAnnotationPresent(PermitAll::class.java)

    private fun findAuthRequired(handler: HandlerMethod): AuthRequired? =
        handler.getMethodAnnotation(AuthRequired::class.java)
            ?: handler.beanType.getAnnotation(AuthRequired::class.java)
}
