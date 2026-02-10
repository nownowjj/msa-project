import type { ArchiveAiAnalyze, ArchiveCreateRequest, ArchiveMetadata, ArchiveResponse, ArchiveUpdateRequest } from "../types/archive";
import { api } from "./api";

/**
 * @param folderId 
 * @returns 폴더 아카이브 조회
 */
export const fetchArchivesByFolder = async (folderId: number):Promise<ArchiveResponse[]> =>{
    const {data} = await api.get<ArchiveResponse[]>(`/archive/${folderId}`);
    return data;
}

/**
 * 전체 아카이브 조회
 */
export const fetchArchivesAll = async ():Promise<ArchiveResponse[]> =>{
    const {data} = await api.get<ArchiveResponse[]>(`/archive`);
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