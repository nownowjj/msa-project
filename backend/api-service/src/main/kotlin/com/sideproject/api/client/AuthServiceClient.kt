package com.sideproject.api.client

import com.sideproject.common.dto.GoogleLoginRequestCode
import com.sideproject.api.security.UnauthorizedException
import com.sideproject.common.auth.AuthVerifyResponse
import com.sideproject.common.dto.LoginResponse
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

//    fun login(request: LoginRequest): LoginResponse =
//        authClient.login(request)

//    fun googleLogin(idToken: String): LoginResponse =
//        authClient.googleLogin(GoogleLoginRequest(idToken))

    //
    fun googleLoginWithCode(code: String): LoginResponse =
        authClient.googleLoginWithCode(GoogleLoginRequestCode(code))
}
