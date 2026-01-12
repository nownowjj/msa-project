package com.sideproject.auth.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.boot.autoconfigure.domain.EntityScan
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

) : BaseTimeEntity() {
    /**
     * 구글 토큰 정보 및 유저 프로필 업데이트 메서드
     */
    fun updateFromGoogle(name: String, picture: String?, accessToken: String, refreshToken: String?) {
        this.name = name
        this.picture = picture
        this.googleAccessToken = accessToken

        // Refresh Token은 처음 1회만 제공되므로, null이 아닐 때만 업데이트
        if (!refreshToken.isNullOrBlank()) {
            this.googleRefreshToken = refreshToken
        }
    }
}

enum class AuthProvider {
    GOOGLE
}
