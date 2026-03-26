import com.sideproject.api.ApiApplication
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(classes = [ApiApplication::class])
class RabbitMqTestController {

    @Autowired
    private lateinit var rabbitTemplate: RabbitTemplate

    @Test
    @DisplayName("OCI RabbitMQ로 메시지가 정상적으로 발송되는지 확인")
    fun testSendMessage() {
        val archiveId = 12345L
        val message = mapOf("archiveId" to archiveId)

        assertDoesNotThrow {
            rabbitTemplate.convertAndSend(
                "linkmint.exchange",
                "link.summary.key",
                message
            )
        }

        println(">>> OCI RabbitMQ로 메시지 전송 완료 : $message")
    }
}