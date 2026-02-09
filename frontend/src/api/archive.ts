import type { ArchiveResponse } from "../types/archive";
import { api } from "./api";

export const fetchArchivesByFolder = async (folderId: number):Promise<ArchiveResponse[]> =>{
    const {data} = await api.get<ArchiveResponse[]>(`/archive/${folderId}`);
    return data;
}