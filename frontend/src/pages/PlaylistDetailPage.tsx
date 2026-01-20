import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchMyPlaylistsItem } from '../api/youtube';
import PlaylistItemComponent from '../components/PlaylistItemComponent';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'

const PlaylistDetailPage = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { data:playlistItems } = useQuery({
    queryKey: ['playlistItems',playlistId],
    queryFn: () => fetchMyPlaylistsItem(playlistId!),
    enabled: !!playlistId, // ID가 있을 때만 실행
    staleTime: 1000 * 60 * 5
  });

  //-----------------------------------------------------------------
  // 선택된 영상 ID 상태 관리 (첫 번째 영상을 기본값으로 설정 가능)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // 데이터가 로드되면 첫 번째 영상 자동 선택
  useEffect(() => {
    if (playlistItems && playlistItems.length > 0 && !selectedVideoId) {
      setSelectedVideoId(playlistItems[0].contentDetails.videoId);
    }
  }, [playlistItems]);
  //-----------------------------------------------------------------
  // 3. 정상 데이터 렌더링
  return (
<div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* 왼쪽: 비디오 플레이어 영역 */}
      <div className="flex-grow">
        {selectedVideoId ? (
          <div className="sticky top-6">
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <ReactPlayer
                src={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                controls
                width="100%"
                height="100%"
                playing={true} // 선택 시 자동 재생
              />
            </div>
            <h2 className="mt-4 text-xl font-bold">현재 재생 중인 영상</h2>
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 animate-pulse rounded-xl" />
        )}
      </div>

      {/* 오른쪽: 영상 리스트 영역 (클릭 시 selectedVideoId 변경) */}
      <div className="lg:w-96 flex flex-col gap-2 overflow-y-auto max-h-screen">
        {playlistItems?.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedVideoId(item.contentDetails.videoId)}
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              selectedVideoId === item.contentDetails.videoId ? 'bg-blue-50 border-blue-200 border' : 'hover:bg-gray-100'
            }`}
          >
            <PlaylistItemComponent item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;