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