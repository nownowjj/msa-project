package com.sideproject.auth.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDateTime

data class KakaoUserResponse(
    val id: Long, // 고유 회원 번호 (providerId로 사용)

    @JsonProperty("connected_at")
    val connectedAt: LocalDateTime?,

    val properties: KakaoProperties,

    @JsonProperty("kakao_account")
    val kakaoAccount: KakaoAccount
)

data class KakaoProperties(
    val nickname: String,

    @JsonProperty("profile_image")
    val profileImage: String,

    @JsonProperty("thumbnail_image")
    val thumbnailImage: String?
)

data class KakaoAccount(
    @JsonProperty("profile_needs_agreement")
    val profileNeedsAgreement: Boolean?,

    val profile: KakaoProfile?,

    @JsonProperty("email_needs_agreement")
    val emailNeedsAgreement: Boolean?,

    @JsonProperty("is_email_valid")
    val isEmailValid: Boolean?,

    @JsonProperty("is_email_verified")
    val isEmailVerified: Boolean?,

    val email: String? // 필수 동의가 아닐 수 있으므로 Nullable 권장
)

data class KakaoProfile(
    val nickname: String?,

    @JsonProperty("thumbnail_image_url")
    val thumbnailImageUrl: String?,

    @JsonProperty("profile_image_url")
    val profileImageUrl: String?
)