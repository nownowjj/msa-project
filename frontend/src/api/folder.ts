import type { FolderNavigationResponse } from "../types/folder";
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