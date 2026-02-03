import org.jsoup.Jsoup
import org.junit.jupiter.api.Test
import org.slf4j.LoggerFactory

class CrawlingTest {
    private val log = LoggerFactory.getLogger(javaClass)

    @Test
    fun crawlNaverBlogThumbnailList() {
        // given
        val url = "https://blog.naver.com/PostList.naver?blogId=cherry_official&from=postList&categoryNo=31"

        val doc = Jsoup.connect(url)
            .userAgent("Mozilla/5.0")
            .referrer("https://blog.naver.com")
            .timeout(10_000)
            .get()

        // .thumblist 기준으로 상위 li 5개 추출
        val items = doc.select(".thumblist")
            .mapNotNull { it.closest("li") }
            .distinct()
            .take(5)

        // 결과 출력
        items.forEachIndexed { index, li ->
            val link = li.selectFirst("a")?.attr("href") ?: ""
            val thumbnail = li.selectFirst(".area_thumb img")?.attr("src") ?: ""
            val title = li.selectFirst(".title.ell")?.text() ?: ""

            log.info("===== ${index + 1} =====")
            log.info("title     : $title")
            log.info("link      : https://blog.naver.com$link")
            log.info("thumbnail : $thumbnail")
            log.info("")

            println("asdsaddas")
        }

    }
}