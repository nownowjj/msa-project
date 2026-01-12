import { GoogleLogin } from '@react-oauth/google';

interface Props {
  onSuccess: (idToken: string) => void;
  onError?: () => void;
}

// 구글 로그인만을 위한 Component
const GoogleLoginButton = ({ onSuccess, onError }: Props) => {
  return (
    <GoogleLogin
      onSuccess={(res) => {
        if (!res.credential) {
          onError?.();
          return;
        }

        // 👉 ID Token만 상위로 전달
        onSuccess(res.credential);
      }}
      onError={() => {
        onError?.();
      }}
    />
  );
};

export default GoogleLoginButton;