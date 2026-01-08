package com.sideproject.api.config

import io.netty.channel.ChannelOption
import io.netty.handler.timeout.ReadTimeoutHandler
import io.netty.handler.timeout.WriteTimeoutHandler
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import java.time.Duration
import java.util.concurrent.TimeUnit

// paymentClient 등등 모듈이 추가될 걸 고려하여 webClient 명은 명시적으로 표기
@Configuration
class WebClientConfig {

    @Bean
    fun authWebClient(
        @Value("\${service.auth.base-url}") baseUrl: String
    ): WebClient {
        val httpClient = HttpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 3000)
            .responseTimeout(Duration.ofSeconds(5))
            .doOnConnected { conn ->
                conn.addHandlerLast(ReadTimeoutHandler(5, TimeUnit.SECONDS))
                conn.addHandlerLast(WriteTimeoutHandler(5, TimeUnit.SECONDS))
            }

        return WebClient.builder()
            .baseUrl(baseUrl)
            .clientConnector(
                ReactorClientHttpConnector(httpClient)
            )
            .build()
    }
}
