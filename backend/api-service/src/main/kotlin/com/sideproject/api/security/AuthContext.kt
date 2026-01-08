package com.sideproject.api.security

import com.sideproject.common.auth.AuthVerifyResponse

object AuthContext {

    private val holder = ThreadLocal<AuthVerifyResponse>()

    fun set(auth: AuthVerifyResponse) {
        holder.set(auth)
    }

    fun get(): AuthVerifyResponse =
        holder.get() ?: throw IllegalStateException("AuthContext is empty")

    fun clear() {
        holder.remove()
    }
}
