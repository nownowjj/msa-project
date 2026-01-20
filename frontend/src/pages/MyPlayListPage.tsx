import { useQuery } from '@tanstack/react-query';
import { fetchMyPlaylists } from '../api/youtube';
import PlaylistCard from '../components/PlaylistCard';

const MyPlayListPage = () => {
  // React Query의 훅을 호출 (async/await 로직이 이 안에 숨어 있음)
  const { data:playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: fetchMyPlaylists,
    staleTime: 1000 * 60 * 5
  });


  // 3. 정상 데이터 렌더링
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">나의 유튜브 재생목록</h1>
      </header>

      {playlists?.length === 0 ? (
        <p className="text-center text-gray-500">조회된 재생목록이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {playlists?.map((playlist) => (
            <PlaylistCard
              key={playlist.id} 
              playlist={playlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPlayListPage;