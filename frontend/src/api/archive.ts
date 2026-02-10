import type { ArchiveAiAnalyze, ArchiveCreateRequest, ArchiveMetadata, ArchiveResponse } from "../types/archive";
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
 * @returns 
 */
export const createArchive = async (request: ArchiveCreateRequest) => {
  const { data } = await api.post('/archive', request);
  return data;
};