import type { YoutubePlaylistDto, YoutubePlaylistItemDto } from '../types/youtube';
import { api } from './api';

/**
 * 
 * @returns 전체 재생 목록
 */
export const fetchMyPlaylists = async (): Promise<YoutubePlaylistDto[]> => {
  const { data } = await api.get('/youtube/playlist');
  return data;
};


/**
 * 
 * @param playlistId 
 * @returns 선택한 재생 목록의 상세
 */
export const fetchMyPlaylistsItem = async (playlistId: string): Promise<YoutubePlaylistItemDto[]> => {
  const { data } = await api.get('/youtube/playlist/items', {
    // axios의 params 객체를 사용하면 자동으로 ?playlistId=xxx 형태로 변환됩니다.
    params: { playlistId }
  });

  return data;
};