// store/useFolderModalStore.ts
import { create } from 'zustand';
import type { FolderNavigationResponse } from '../types/folder';


interface FolderModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  folderData: FolderNavigationResponse | null; // 수정 시 필요
  parentId: number | null; // ✅ 하위 폴더 생성 시 부모 폴더 ID

  openAddSubFolderModal: (parentId: number) => void;
  openCreateModal: () => void; // 일반 생성
  openEditModal: (folder: FolderNavigationResponse) => void; // 수정

  closeModal: () => void;
}

export const useFolderModalStore = create<FolderModalState>((set) => ({
  isOpen: false,
  mode: 'create',
  folderData: null,
  parentId: null, // 초기화

  // 1. 하위 폴더 생성: parentId를 인자로 받아 설정
  openAddSubFolderModal: (parentId) => 
    set({ isOpen: true, mode: 'create', folderData: null, parentId }),

  // 2. 일반 생성: parentId를 반드시 null로 명시적 초기화 🌟
  openCreateModal: () => 
    set({ isOpen: true, mode: 'create', folderData: null, parentId: null }),

  // 3. 수정: 기존 폴더의 부모 ID를 넣어주거나, 상황에 따라 null 처리
  openEditModal: (folder) => 
    set({ isOpen: true, mode: 'edit', folderData: folder, parentId: folder.parentId ?? null }),

  // 4. 닫기: 모든 데이터 초기화 🌟
  closeModal: () => 
    set({ isOpen: false, mode: 'create', folderData: null, parentId: null }),
}));