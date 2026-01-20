import type { YoutubePlaylistDto, YoutubePlaylistItemDto } from '../types/youtube';
import { api } from './api';

// 기존에 만든 Axios 인스턴스 (인터셉터 포함)를 가져온다고 가정


export const fetchMyPlaylists = async (): Promise<YoutubePlaylistDto[]> => {
  const { data } = await api.get('/youtube/playlist');
  return data;
};

// export const fetchMyPlaylistsItem = async (playlistId:string): Promise<YoutubePlaylistItemDto[]> => {
//   const { data } = await api.get('/youtube/playlist/items' ,  {playlistId:playlistId} );
//   return data;
// };

export const fetchMyPlaylistsItem = async (playlistId: string): Promise<YoutubePlaylistItemDto[]> => {
  const { data } = await api.get('/youtube/playlist/items', {
    // axios의 params 객체를 사용하면 자동으로 ?playlistId=xxx 형태로 변환됩니다.
    params: { playlistId }
  });
  return data;
};