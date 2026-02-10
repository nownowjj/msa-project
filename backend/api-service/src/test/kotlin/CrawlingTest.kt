import org.jsoup.Jsoup
import org.junit.jupiter.api.Test
import org.slf4j.LoggerFactory

class CrawlingTest {
    private val log = LoggerFactory.getLogger(javaClass)

    @Test
    fun crawlNaverBlogThumbnailList() {
        // given
        val url = "https://blog.naver.com/PostList.naver?blogId=cherry_official&from=postList&categoryNo=42"
//        val url = "https://blog.naver.com/PostList.naver?blogId=cherry_official&from=postList&categoryNo=31"

        val doc = Jsoup.connect(url)
            .userAgent("Mozilla/5.0")
            .referrer("https://blog.naver.com")
            .timeout(10_000)
            .get()

        val items = doc.select(".thumblist li.item") // .thumblist 안에 있는 li.item들을 직접 선택
            .take(5)


        items.forEachIndexed { index, li ->
            val link = li.selectFirst("a")?.attr("href") ?: ""
            val thumbnail = li.selectFirst(".area_thumb img")?.attr("src") ?: ""
            val title = li.selectFirst(".title.ell")?.text() ?: ""

            log.info("===== ${index + 1} =====")
            log.info("title     : $title")
            log.info("link      : https://blog.naver.com$link")
            log.info("thumbnail : $thumbnail")
        }

    }
}