import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import DashBoard from '../../pages/DashBoard';
import LoginPage from '../../pages/Login';
import MyPage from '../../pages/MyPage';
import MyPlayListPage from '../../pages/MyPlayListPage';
import PlaylistDetailPage from '../../pages/PlaylistDetailPage';
import Privacy from '../../pages/Privacy';
import Terms from '../../pages/Terms';
import ProtectedRoute from './ProtectedRoute';
import KakaoCallback from '../oauth/KakaoCallback';


// 페이지 컴포넌트들...

const AppRouter = () => {
    const navigate = useNavigate();

    // useEffect(() => {
    //     // 이제 여기는 BrowserRouter 내부이므로 navigate 사용 가능
    //     if (localStorage.getItem('token')) {
    //         navigate('/board', { replace: true });
    //     }
    // }, [navigate]);

    return (
        <Routes>
            {/* [공용 라우트] 누구나 접근 가능 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />

            {/* 기본 경로 설정 */}

            {/* [보호된 라우트] 로그인이 필요한 페이지들 */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/me" element={<MyPage />} />
                <Route path="/playlists" element={<MyPlayListPage />} />
                <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
                <Route path="/board" element={<DashBoard />} />
            </Route>

            {/* 그 외 정의되지 않은 모든 경로는 로그인으로 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRouter;