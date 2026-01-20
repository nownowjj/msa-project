package com.sideproject.api.client

import com.sideproject.api.security.UnauthorizedException
import com.sideproject.common.auth.AuthVerifyResponse
import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.dto.TokenInfoResponse
import feign.FeignException
import org.springframework.stereotype.Component

@Component
class AuthServiceClient(
    private val authClient: AuthClient
) {

    fun verify(token: String): AuthVerifyResponse =
        try {
            authClient.verify(token)
        } catch (e: FeignException.Unauthorized) {
            throw UnauthorizedException()
        }

    // 구글 로그인 처리 및 access, refresh token 발급하여 DB 저장
    fun googleLoginWithCode(code: String): LoginResponse =
        authClient.googleLoginWithCode(GoogleLoginRequestCode(code))

    // 유효한 google access_token 발급
    fun getToken(email: String): TokenInfoResponse =
        authClient.getToken(email)

}
