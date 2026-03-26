import type { ArchiveResponse } from "../types/archive";
import type { PageResponse } from "../types/Page";
import { api } from "./api";

// 공유 폴더 응답 전체 구조
export interface SharedFolderResponse {
  folderId: number;
  folderName: string;
  ownerId: number;
  accessRole: 'VIEWER' | 'EDITOR'; // 권한 타입
  archives: PageResponse<ArchiveResponse>; // 기존 페이징 구조 재사용
}

// 1. 요청 보낼 때 사용할 타입 정의
export interface ShareRequest {
  folderId: number;
  role: 'VIEWER' | 'EDITOR';
}

export interface makeShareFolderResponse {
  shareToken: string;
  shareUrl: string;
  role: 'VIEWER' | 'EDITOR';
  folderName?: string;
}

/**
 * @param token 공유 토큰 (v_... 또는 e_...)
 * @returns 공유 폴더 정보 및 아카이브 목록
 */
export const fetchSharedArchives = async (
  token: string, 
  page: number = 0
): Promise<SharedFolderResponse> => {
  // 경로는 이전에 만든 public API 경로에 맞춥니다.
  const { data } = await api.get<SharedFolderResponse>(`/share/public/${token}`, {
    params: { page, size: 20 }
  });
  return data;
};


// 1. API 호출 함수
export const shareFolder = async (folderId: number, role: 'VIEWER' | 'EDITOR') => {
  const { data } = await api.post('/share', { folderId, role });
  return data; // ShareFolderResponse
};
