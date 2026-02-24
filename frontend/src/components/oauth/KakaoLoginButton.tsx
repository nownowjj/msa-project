// components/oauth/KakaoLoginButton.tsx
import { OAuthButton } from '../../pages/Login';

interface KakaoLoginButtonProps {
  onSuccess: () => void;
}

const KakaoLoginButton = ({ onSuccess }: KakaoLoginButtonProps) => {
  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    // 필요한 경우 로그인 시도 전 로컬스토리지 작업 등을 수행 가능
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <OAuthButton className="kakao" onClick={handleLogin}>
        <span>💬</span>
        <span>카카오 계정으로 계속하기</span>
    </OAuthButton>
  );
};

export default KakaoLoginButton;