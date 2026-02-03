package com.sideproject.api.archive.dto

data class GeminiRequest(
    val contents: List<Content>
) {
    companion object {
        fun from(prompt: String) = GeminiRequest(
            contents = listOf(Content(parts = listOf(Part(text = prompt))))
        )
    }
}
data class Content(val parts: List<Part>)
data class Part(val text: String)

data class GeminiAiResponse(
    val summary: String?,
    val keywords: List<String>?
)