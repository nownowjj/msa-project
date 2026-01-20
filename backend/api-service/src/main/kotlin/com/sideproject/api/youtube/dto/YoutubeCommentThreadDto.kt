package com.sideproject.api.youtube.dto

data class YoutubeCommentThreadDto(
    val id: String,
    val snippet: CommentThreadSnippet
)

data class CommentThreadSnippet(
    val videoId: String,
    val topLevelComment: TopLevelComment,
    val totalReplyCount: Int,
    val isPublic: Boolean
)

data class TopLevelComment(
    val id: String,
    val snippet: CommentSnippet
)

data class CommentSnippet(
    val textDisplay: String,
    val textOriginal: String,
    val authorDisplayName: String,
    val authorProfileImageUrl: String,
    val authorChannelUrl: String,
    val likeCount: Int,
    val publishedAt: String,
    val updatedAt: String
)