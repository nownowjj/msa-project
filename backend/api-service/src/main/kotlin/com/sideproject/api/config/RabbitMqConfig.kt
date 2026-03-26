package com.sideproject.api.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitMqConfig {

    companion object {
        const val EXCHANGE_NAME = "linkmint.exchange"
        const val QUEUE_NAME = "link.summary.queue"
        const val ROUTING_KEY = "link.summary.key"
    }

    // 1. 메시지 보관소(Queue) 생성
    @Bean
    fun queue(): Queue = Queue(QUEUE_NAME, true)

    // 2. 메시지 라우터(Exchange) 생성
    @Bean
    fun exchange(): DirectExchange = DirectExchange(EXCHANGE_NAME)

    // 3. Queue와 Exchange 연결 (Binding)
    @Bean
    fun binding(queue: Queue, exchange: DirectExchange): Binding {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY)
    }

    // 4. 메시지를 JSON 형태로 주고받기 위한 컨버터
    @Bean
    fun messageConverter(): MessageConverter = Jackson2JsonMessageConverter()
}