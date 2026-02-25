package com.sideproject.api.client

import com.sideproject.api.security.UnauthorizedException
import com.sideproject.common.auth.AuthVerifyResponse
import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.common.dto.LoginResponse
import com.sideproject.common.dto.SocialLoginRequest
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

    // 유효한 google access_token 발급
    fun getToken(email: String): TokenInfoResponse =
        authClient.getToken(email)

    fun socialLogin(provider: String , code: String): LoginResponse =
        authClient.socialLogin(provider,code)

}
