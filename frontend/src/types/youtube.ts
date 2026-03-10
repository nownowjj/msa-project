import type { ArchiveResponse } from "./archive";

// types/youtube.ts 등에 위치시키면 좋습니다.
export const isPlaylistItem = (item: any): item is YoutubePlaylistItemDto => {
  return (item as YoutubePlaylistItemDto).snippet?.resourceId !== undefined;
};

export const mapYoutubeToArchive = (item: any): Partial<ArchiveResponse> => {
  // 실제 YouTube API 응답 구조에 맞게 데이터 추출
  const snippet = item.snippet;
  const contentDetails = item.contentDetails;
  const videoId = snippet.resourceId?.videoId || contentDetails?.videoId || item.id;

  return {
    id: 0, // 생성 전이므로 임시 값
    title: snippet.title || '',
    aiSummary: snippet.description || '', // 초기값으로 description 전달
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: snippet.thumbnails?.standard?.url || snippet.thumbnails?.high?.url || '',
  };
};


// 1. 공통 썸네일 상세 정보
export interface ThumbnailDetail {
  url: string;
  width: number;
  height: number;
}

// 2. 유튜브 썸네일 세트 (여러 해상도)
export interface Thumbnails {
  default: ThumbnailDetail;
  high: ThumbnailDetail; // 카드 UI에서 주로 사용하므로 필수로 지정
  maxres: ThumbnailDetail;
  medium: ThumbnailDetail;
  standard: ThumbnailDetail;
}

// 3. 재생목록 Snippet 정보
export interface PlaylistSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
}

// 4. 재생목록 상세 정보 (아이템 개수 등)
export interface PlaylistContentDetails {
  videoId?: string;

  itemCount: number;
}

// 5. 최종 재생목록 DTO
export interface YoutubePlaylistDto {
  id: string;
  snippet: PlaylistSnippet;
  contentDetails: PlaylistContentDetails;
}

// -----------------재생목록 상세 ----------------------
// 최종 상세 아이템 DTO
export interface YoutubePlaylistItemDto {
  id: string;
  snippet: PlaylistItemSnippet;
  contentDetails: PlaylistItemContentDetails;
}

export interface PlaylistItemSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  playlistId: string;
  position: number;
  resourceId: ResourceId;
}

export interface PlaylistItemContentDetails {
  videoId: string;
  videoPublishedAt: string;
}

export interface ResourceId {
  kind: string;
  videoId: string;
}
// -----------------재생목록 상세 ----------------------