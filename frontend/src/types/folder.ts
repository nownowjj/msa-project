export interface FolderNavigationResponse {
    id: number;
    name: string;
    depth: number;
    parentId: number | null;
    archiveCount: number;
    sortOrder: number;
    children: FolderNavigationResponse[];
}