// store/useFolderModalStore.ts
import { create } from 'zustand';
import type { FolderNavigationResponse } from '../types/folder';


interface FolderModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  folderData: FolderNavigationResponse | null; // 수정 시 필요
  openCreateModal: () => void;
  openEditModal: (folder: FolderNavigationResponse) => void;
  closeModal: () => void;
}

export const useFolderModalStore = create<FolderModalState>((set) => ({
  isOpen: false,
  mode: 'create',
  folderData: null,
  openCreateModal: () => set({ isOpen: true, mode: 'create', folderData: null }),
  openEditModal: (folder) => set({ isOpen: true, mode: 'edit', folderData: folder }),
  closeModal: () => set({ isOpen: false }),
}));