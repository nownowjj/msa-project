import com.sideproject.api.ApiApplication
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.redis.DataRedisTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.redis.core.RedisTemplate
import org.assertj.core.api.Assertions.assertThat
import org.slf4j.LoggerFactory
import java.time.Duration

@SpringBootTest(classes = [ApiApplication::class])
class RedisConnectionTest @Autowired constructor(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Test
    @DisplayName("1. String 데이터 저장 및 조회 (Create & Read)")
    fun stringSaveReadTest() {
        // given
        val key = "test:string"
        val value = "Gemini AI"

        // when
        redisTemplate.opsForValue().set(key, value)
        val result = redisTemplate.opsForValue().get(key) as String

        // then
        assertThat(result).isEqualTo(value)
    }

    @Test
    @DisplayName("2. 객체(DTO) 직렬화 저장 및 조회 (Object CRUD)")
    fun objectSaveReadTest() {
        // given
        val key = "test:user:1"
        val user = TestUser(1L, "Gemini", "gemini@example.com")

        // when
        redisTemplate.opsForValue().set(key, user)
        val result = redisTemplate.opsForValue().get(key) as TestUser?

        // then
        assertThat(result).isNotNull
        assertThat(result?.name).isEqualTo("Gemini")
        assertThat(result?.email).isEqualTo("gemini@example.com")
    }

    @Test
    @DisplayName("3. 데이터 수정 (Update)")
    fun updateTest() {
        // given
        val key = "test:update"
        redisTemplate.opsForValue().set(key, "Old Value")

        // when
        redisTemplate.opsForValue().set(key, "New Value")
        val result = redisTemplate.opsForValue().get(key) as String

        // then
        assertThat(result).isEqualTo("New Value")
    }

    @Test
    @DisplayName("4. 데이터 삭제 (Delete)")
    fun deleteTest() {
        // given
        val key = "test:delete"
        redisTemplate.opsForValue().set(key, "To be deleted")

        // when
        redisTemplate.delete(key)
        val result = redisTemplate.opsForValue().get(key)

        // then
        assertThat(result).isNull()
    }

    @Test
    @DisplayName("5. 만료 시간 설정 테스트 (TTL)")
    fun ttlTest() {
        // given
        val key = "test:ttl"
        val value = "Temporary Data"

        // when (3초 후 만료 설정)
        redisTemplate.opsForValue().set(key, value, Duration.ofSeconds(3))

        // then 1: 즉시 조회 시 존재해야 함
        assertThat(redisTemplate.hasKey(key)).isTrue()

        // then 2: 4초 대기 후 조회 시 없어야 함
        Thread.sleep(4000)
        assertThat(redisTemplate.hasKey(key)).isFalse()
    }
}

data class TestUser(
    val id: Long,
    val name: String,
    val email: String
)