import { create } from 'zustand';
import { fetchMyPlaylistsItem } from '../api/youtube';
import type { YoutubePlaylistDto, YoutubePlaylistItemDto } from '../types/youtube';

type ViewMode = 'ALL_PLAYLISTS' | 'PLAYLIST_DETAIL';

interface YoutubeStore {
  viewMode: ViewMode;
  playlists: YoutubePlaylistDto[];
  selectedPlaylistId: string | null;
  playlistItems: YoutubePlaylistItemDto[];
  isLoading: boolean;

  selectPlaylist: (id: string) => Promise<void>;
  resetToAll: () => void;

  // ... 기존 상태
  selectedVideoId: string | null;
  isModalOpen: boolean;

  // Actions
  openVideoModal: (videoId: string) => void;
  closeVideoModal: () => void;
}

export const useYoutubeStore = create<YoutubeStore>((set,get) => ({
  viewMode: 'ALL_PLAYLISTS',
  playlists: [],
  selectedPlaylistId: null,
  playlistItems: [],
  isLoading: false,


  selectPlaylist: async (id: string) => {
    set({ isLoading: true, selectedPlaylistId: id });
    try {
      const items = await fetchMyPlaylistsItem(id);
      set({ 
        playlistItems: items, 
        viewMode: 'PLAYLIST_DETAIL' 
      });
    } catch (error) {
      console.error("재생목록 상세 로드 실패:", error);
      // 에러 처리 로직을 여기에 추가하면 좋습니다.
    } finally {
      set({ isLoading: false });
    }
  },

  resetToAll: () => set({ viewMode: 'ALL_PLAYLISTS', selectedPlaylistId: null, playlistItems: [] }),

  // ... 기존 초기값
  selectedVideoId: null,
  isModalOpen: false,

  openVideoModal: (videoId) => set({ isModalOpen: true, selectedVideoId: videoId }),
  closeVideoModal: () => set({ isModalOpen: false, selectedVideoId: null }),
}));