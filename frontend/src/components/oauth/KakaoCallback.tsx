// pages/oauth/KakaoCallback.tsx
import { useEffect } from 'react';
import { useOAuthLogin } from '../../hooks/useOAuthLogin';
import KakaoLoginButton from './KakaoLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';
import YoutubeConnectButton from '../Youtube/YoutubeConnectButton';
import { BackgroundShape, Footer, FooterLink, FooterText, LoginContainer, Logo, LogoSection, LogoText, OAuthButton, OAuthButtons, OAuthView, PageContainer, Subtitle } from '../../pages/Login';
import AppIcon from '../common/LinkMintLogo';
import { LoadingOverlay } from '../common/LoadingOverlay';

const KakaoCallback = () => {
  const { login } = useOAuthLogin();

  useEffect(() => {
    // URL에서 ?code=... 부분을 추출
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      login('KAKAO', code);
    } else {
      console.error('인가 코드가 없습니다.');
    }
  }, []);

  return (
    <PageContainer>
      <LoadingOverlay message="카카오 계정으로 로그인 중..." />
      <BackgroundShape className="shape-1" />
      <BackgroundShape className="shape-2" />
      <BackgroundShape className="shape-3" />

      <LoginContainer>
        {/* Logo & Header */}
        <LogoSection>
          <Logo>
            <AppIcon size={48} />
            <LogoText>Link Mint</LogoText>
          </Logo>
          <Subtitle>소셜 계정으로 간편하게 로그인하세요</Subtitle>
        </LogoSection>

        
        <OAuthView>
          <OAuthButtons>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <YoutubeConnectButton
                onSuccess={(code) => {
                  // useGoogleLoginSuccess(code);
                  login('GOOGLE', code);
                }}
              />
            </GoogleOAuthProvider>

            <KakaoLoginButton onSuccess={() => console.log('카카오 리다이렉트 시작')} />
            <OAuthButton className="github">
              <span>⚫</span>
              <span>GitHub 계정으로 계속하기</span>
            </OAuthButton>

            <OAuthButton className="naver" >
              <span style={{ fontWeight: 800 }}>N</span>
              <span>네이버 계정으로 계속하기</span>
            </OAuthButton>
          </OAuthButtons>
        </OAuthView>
        
        

        {/* Footer */}
        <Footer>
          {/* <FooterText>
            계정이 없으신가요? <FooterLink href="#">회원가입</FooterLink>
          </FooterText> */}
          <FooterText style={{ marginTop: '8px' }}>
            <FooterLink href="/terms">이용약관</FooterLink> · 
            <FooterLink href="/privacy">개인정보처리방침</FooterLink>
          </FooterText>
        </Footer>
      </LoginContainer>
    </PageContainer>
  );
};

export default KakaoCallback;