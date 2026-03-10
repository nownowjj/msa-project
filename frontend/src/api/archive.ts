import type { ArchiveAiAnalyze, ArchiveCreateRequest, ArchiveMetadata, ArchiveResponse, ArchiveUpdateRequest } from "../types/archive";
import type { PageResponse } from "../types/Page";
import { api } from "./api";

/**
 * @param folderId 
 * @returns 폴더 아카이브 조회
 */
export const fetchArchivesByFolder = async (folderId: number, page: number = 0): Promise<PageResponse<ArchiveResponse>> => {
    const { data } = await api.get<PageResponse<ArchiveResponse>>(`/archive/${folderId}`, {
        params: { page, size: 20 } // 페이지당 20개씩 호출
    });
    return data;
}

/**
 * 전체 아카이브 조회
 */
export const fetchArchivesAll = async (page: number = 0): Promise<PageResponse<ArchiveResponse>> => {
    const { data } = await api.get<PageResponse<ArchiveResponse>>(`/archive`, {
        params: { page, size: 20 }
    });
    return data;
}

/**
 * 아카이브 검색 조회
 */
export const fetchSearchArchives = async (searchQuery: string, page: number = 0): Promise<PageResponse<ArchiveResponse>> => {
    const { data } = await api.get<PageResponse<ArchiveResponse>>(`/archive/search`, {
        // params 객체에 넣으면 자동으로 ?query=검색어&page=0&size=20 형태로 만들어줍니다.
        params: { 
            query: searchQuery, 
            page, 
            size: 20 
        }
    });
    return data;
}

/**
 * @param url 
 * @returns url Crawling Metadata
 */
export const fetchArchiveMetadata = async (url: string):Promise<ArchiveMetadata> =>{
    const {data} = await api.get<ArchiveMetadata>(`/scraper`,{
        params: { url }
    });
    return data;
}


/**
 * @param url 
 * @returns  url Ai 요약 , 키워드
 */
export const fetchArchiveAiAnalyze = async (url: string):Promise<ArchiveAiAnalyze> =>{
    const {data} = await api.get<ArchiveAiAnalyze>(`/gemini`,{
        params: { url }
    });
    return data;
}

/**
 * AI 요청 validate
 * @param url 
 * @returns msg 
 */
export const getUrlValidationError = (url: string | null | undefined): string | null => {
  // 1. 빈 값 체크 (Presence Check)
  if (!url || url.trim() === "") {
    return "URL을 입력해 주세요.";
  }

  // 2. 형식 체크 (Protocol Check)
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "유효하지 않은 URL입니다.";
  }

  try {
    const parsedUrl = new URL(url);

    // 3. 보안 체크 (XSS & Script Injection 방지)
    if (url.toLowerCase().includes("javascript:") || url.includes("<script")) {
      return "보안상 허용되지 않는 형식이 포함되어 있습니다.";
    }

    // 4. 도메인 정책 체크 (Blacklist)
    // 크롤링을 명시적으로 막거나 AI 분석이 무의미한 도메인 차단
    const forbiddenDomains = ["instagram.com", "facebook.com", "tiktok.com", "youtube.com"];
    if (forbiddenDomains.some(domain => parsedUrl.hostname.includes(domain))) {
      return "해당 사이트는 정책상 AI 분석이 불가능한 도메인입니다.";
    }

    // 5. 길이 제한 (DoS 방지)
    if (url.length > 2000) {
      return "URL 길이가 너무 깁니다.";
    }

  } catch (e) {
    return "올바른 URL 형식이 아닙니다.";
  }

  return null; // 모든 검증 통과
};

/**
 * @param request 
 * @returns 아카이브 생성 {생성된 아카이브}
 */
export const createArchive = async (request: ArchiveCreateRequest) => {
  const { data } = await api.post('/archive', request);
  return data;
};


/**
 * @param id 
 * @param request 
 * @returns 아카이브 수정
 */
export const updateArchive = async (id: number, request: ArchiveUpdateRequest) => {
  const { data } = await api.patch(`/archive/${id}`, request);
  return data;
};


/**
 * 
 * @param id 
 * @returns 아카이브 삭제
 */
export const deleteArchive = async (id: number) => {
  const { data } = await api.delete(`/archive/${id}`);
  return data;
};