import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // 개발 도구 (선택 사항)

import Login from './pages/Login';
import MyPage from './pages/MyPage';
import MyPlayListPage from './pages/MyPlayListPage'; // 아까 만든 페이지
import PlaylistDetailPage from './pages/PlaylistDetailPage';

// 1. QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 만료되었다고 판단하는 시간 (5분)
      staleTime: 1000 * 60 * 5,
      // API 실패 시 재시도 횟수
      retry: 1,
      // 윈도우 포커스 시 자동 새로고침 방지 (의도치 않은 API 호출 방지)
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    // 2. QueryClientProvider로 앱 전체를 감싸기
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 기본 경로 설정: 로그인으로 리다이렉트하거나 메인 페이지 지정 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/me" element={<MyPage />} />
          
          {/* 재생목록 페이지 경로 추가 */}
          <Route path="/playlists" element={<MyPlayListPage />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
        </Routes>
      </BrowserRouter>
      
      {/* 개발 중에 데이터 상태를 확인하기 위한 도구 (배포 시엔 자동 제외됨) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;