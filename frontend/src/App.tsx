import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // 개발 도구 (선택 사항)
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import AppRouter from './components/Router/AppRouter';

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <ReactQueryDevtools 
        initialIsOpen={false} 
        buttonPosition="bottom-left" // 열기/닫기 버튼의 위치만 따로 설정 가능
      />
    </QueryClientProvider>
  );
}

export default App;