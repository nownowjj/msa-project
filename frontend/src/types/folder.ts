export interface FolderNavigationResponse {
    id: number;
    name: string;
    depth: number;
    parentId: number | null;
    archiveCount: number;
    sortOrder: number;
    children: FolderNavigationResponse[];
}

export interface FolderCreateRequest {
  name: string;
  parentId: number | null;
}

export interface FolderUpdateRequest {
  name?: string;
  parentId?: number | null;
}