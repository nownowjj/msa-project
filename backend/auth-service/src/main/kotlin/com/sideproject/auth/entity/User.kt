package com.sideproject.auth.entity

import com.sideproject.common.entity.BaseTimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    val email: String,

    var name: String,

    // 프로필 이미지 URL 추가
    var picture: String? = null,

    @Enumerated(EnumType.STRING)
    val provider: AuthProvider,

    val providerId: String,

    // 1. 구글로부터 받은 마스터 키 (재발급용)
    @Column(name = "google_refresh_token", columnDefinition = "TEXT")
    var googleRefreshToken: String? = null,

    // 2. 현재 유효한 액세스 토큰 (선택사항이지만 성능상 권장)
    @Column(name = "google_access_token", columnDefinition = "TEXT")
    var googleAccessToken: String? = null,

    // 만료 시간 필드 추가 (초 단위 expiry_in을 현재시간 + 초로 계산해서 저장)
    var googleTokenExpiresAt: LocalDateTime? = null

) : BaseTimeEntity() {
    /**
     * 구글 토큰 정보 및 유저 프로필 업데이트 메서드
     */
// User.kt 내부
    fun updateFromGoogle(
        name: String,
        picture: String?,
        accessToken: String,
        refreshToken: String?,
        expiresAt: LocalDateTime // 추가
    ) {
        this.name = name
        this.picture = picture
        this.googleAccessToken = accessToken
        this.googleTokenExpiresAt = expiresAt // 추가

        // Refresh Token은 처음에만 오거나 보안상 새로 발급될 때만 오므로 체크 후 업데이트
        if (!refreshToken.isNullOrBlank()) {
            this.googleRefreshToken = refreshToken
        }
    }
}

enum class AuthProvider {
    GOOGLE
}
