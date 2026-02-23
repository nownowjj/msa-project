import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  
  // localStorage에서 토큰 존재 여부 확인
  const accessToken = localStorage.getItem('token');

  if (!accessToken) {
    // 💡 로그인이 안 되어 있으면 로그인 페이지로 보내되, 
    // 원래 가려던 페이지 정보를 state로 넘겨주면 로그인 후 다시 일로 보내줄 수 있어 편리합니다.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 토큰이 있으면 자식 컴포넌트(Outlet) 렌더링
  return <Outlet />;
};

export default ProtectedRoute;