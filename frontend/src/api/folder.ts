import type { FolderNavigationResponse } from "../types/folder";
import { api } from "./api";

export const fetchAllFolder = async ():Promise<FolderNavigationResponse[]> =>{
    const {data} = await api.get<FolderNavigationResponse[]>('/folder');
    return data;
}