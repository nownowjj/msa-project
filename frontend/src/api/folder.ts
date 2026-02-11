import type { FolderCreateRequest, FolderNavigationResponse, FolderUpdateRequest } from "../types/folder";
import { api } from "./api";


/** * 모든 폴더 목록 내에서 기본 폴더(sortOrder: 0)를 찾는 함수
 * 전제 조건: 사용자별로 sortOrder가 0인 폴더는 무조건 1개 존재함
 */
export const findDefaultFolder = (folders: FolderNavigationResponse[] | undefined): FolderNavigationResponse | null => {
    if (!folders) return null;

    // sortOrder가 0인 폴더를 즉시 찾아 반환
    return folders.find(f => f.sortOrder === 0) || null;
};

/**
 * 
 * @returns Folder
 */
export const fetchAllFolder = async ():Promise<FolderNavigationResponse[]> =>{
    const {data} = await api.get<FolderNavigationResponse[]>('/folder');
    return data;
}


/**
 * @param request 
 * @returns 폴더 생성 {생성된 폴더 ID}
 */
export const createFolder = async (request: FolderCreateRequest) => {
  const { data } = await api.post<number>('/folder', request);
  return data;
};


/**
 * @param id 
 * @param request 
 * @returns 폴더 수정 (이름 변경 및 계층 이동)
 */
export const updateFolder = async (id: number, request: FolderUpdateRequest) => {
  const { data } = await api.patch(`/folder/${id}`, request);
  return data;
};


/**
 * @param id 
 * @returns 폴더 삭제 (하위 폴더 및 아카이브 정리)
 */
export const deleteFolder = async (id: number) => {
  const { data } = await api.delete(`/folder/${id}`);
  return data;
};