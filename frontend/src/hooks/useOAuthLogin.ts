import { useRef } from 'react'; // useRef 사용
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../store/useAuthStore';

export const useOAuthLogin = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();
  const isProcessing = useRef(false);

  const { login: setAuth } = useAuthStore(); // 스토어의 login 함수명을 커스텀 훅의 login과 구분하기 위해 alias 사용

  const login = async (provider: 'GOOGLE' | 'KAKAO', code: string) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const response = await api.post(`/auth/login/${provider.toUpperCase()}`, { code });
      const { accessToken, userId, profile, message, email, name } = response.data;

      localStorage.setItem('token', accessToken);

      setAuth({
        id: userId,
        picture: profile,
        email: email || '', // 응답에 email이 있다면 포함
        name: name || '사용자', // 응답에 name이 있다면 포함
      });

      // ✅ 1. 백엔드에서 온 안내 메시지가 있는 경우 (이메일 중복 로그인 등)
      if (message) {
        await showAlert(message);
      }
      navigate('/board', { replace: true });

    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      // 에러가 났을 때만 다시 시도할 수 있도록 초기화
      isProcessing.current = false; 
      
      showAlert('로그인에 실패했습니다.\n다시 시도해주세요.');
      navigate('/login');
    } finally {
      // 성공/실패 여부와 상관없이 처리가 끝났으므로 Flag 초기화
      isProcessing.current = false;
    }
  };

  return { login };
};