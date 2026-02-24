import { useGoogleLogin } from '@react-oauth/google';
import { OAuthButton } from '../../pages/Login';

const YoutubeConnectButton = ({ onSuccess }: { onSuccess: (token: string) => void }) => {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl profile email',
    flow: 'auth-code', 
    redirect_uri: 'http://localhost:5173/login',
    onSuccess: (res) => {
      onSuccess(res.code);
    },
    onError: () => {
      alert('YouTube 연동 실패');
    },
  });

  return (
    <OAuthButton className="google" onClick={() => login()}>
      <span className="icon">🔍</span>
      <span>Google 계정으로 계속하기</span>
    </OAuthButton>
  );
};

export default YoutubeConnectButton;