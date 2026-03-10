import { create } from "zustand";

interface FolderState {
  activeFolder: { id: number; name: string };
  setActiveFolder: (id: number, name: string) => void;
  resetActiveFolder: () => void;
}

export const useFolderStore = create<FolderState>((set) => ({
  activeFolder: { id: -1, name: '전체보기' },
  
  setActiveFolder: (id, name) => set({ activeFolder: { id, name } }),
  
  resetActiveFolder: () => set({ activeFolder: { id: -1, name: '전체보기' } }),
}));