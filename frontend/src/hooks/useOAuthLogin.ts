import { useRef } from 'react'; // useRef 사용
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAlertStore } from './useAlertStore';

export const useOAuthLogin = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();
  const isProcessing = useRef(false);

  const login = async (provider: 'GOOGLE' | 'KAKAO', code: string) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const response = await api.post(`/auth/login/${provider.toUpperCase()}`, { code });
      const { accessToken , message } = response.data;
      localStorage.setItem('token', accessToken);

      // ✅ 1. 백엔드에서 온 안내 메시지가 있는 경우 (이메일 중복 로그인 등)
      if (message) {
        await showAlert(message);
      }
      navigate('/board', { replace: true });

    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      // 에러가 났을 때만 다시 시도할 수 있도록 초기화
      isProcessing.current = false; 
      
      showAlert('로그인에 실패했습니다.<br/>다시 시도해주세요.');
      navigate('/login');
    } finally {
      // 성공/실패 여부와 상관없이 처리가 끝났으므로 Flag 초기화
      isProcessing.current = false;
    }
  };

  return { login };
};