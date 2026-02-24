import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react'; // useRef 사용

export const useOAuthLogin = () => {
  const navigate = useNavigate();
  // 요청 중인지 확인하기 위한 Flag (React StrictMode 대응)
  const isProcessing = useRef(false);

  const login = async (provider: 'GOOGLE' | 'KAKAO', code: string) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const response = await axios.post(`/api/auth/login/${provider.toUpperCase()}`, { code });
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);

      console.log("Navigating...");
      
      // replace: true 옵션이 현재 경로와 충돌하는지 확인하기 위해 제거 후 시도
      navigate('/board', { replace: true });
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      // 에러가 났을 때만 다시 시도할 수 있도록 초기화
      isProcessing.current = false; 
      
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/login');
    }
  };

  return { login };
};