import { useGoogleLogin } from '@react-oauth/google';

const YoutubeConnectButton = ({ onSuccess }: { onSuccess: (token: string) => void }) => {
  const login = useGoogleLogin({
    // scope: 'https://www.googleapis.com/auth/youtube.readonly profile email',
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl profile email',
    flow: 'auth-code', // 또는 'authorization_code' (권장),
    redirect_uri: 'http://localhost:5173/login',
    onSuccess: (res) => {
      onSuccess(res.code);
    },
    onError: () => {
      alert('YouTube 연동 실패');
    },
  });

  return (
    <button onClick={() => login()}>
      유튜브 권한 및 로그인
    </button>
  );
};

export default YoutubeConnectButton;