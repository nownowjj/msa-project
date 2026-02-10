export interface ArchiveResponse {
    id: number;
    userId: number;
    folderId: number;
    url: string;
    title: string | null;         // null 허용 (서버 title: String?)
    thumbnailUrl: string | null;  // null 허용
    aiSummary: string | null;     // null 허용
    keywords: string[];           // 가공된 문자열 리스트
    createdAt: string;            // LocalDateTime은 JSON 직렬화 시 ISO 8601 문자열로 변환됨
}

export interface ArchiveMetadata {
    title?: string;
    thumbnailUrl?: string;
}

export interface ArchiveAiAnalyze {
    summary?: string;
    keywords?: string[];
}

export interface ArchiveCreateRequest {
    url: string;
    title: string;
    thumbnailUrl: string | null;
    aiSummary: string | null;
    folderId: number;
    keywords: string[] | null;
}

export interface ArchiveUpdateRequest {
    title: string;
    aiSummary: string | null;
    folderId: number;
    keywords: string[] | null;
}