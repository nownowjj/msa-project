import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState } from 'react';
import styled from 'styled-components';
import YoutubeConnectButton from '../components/Youtube/YoutubeConnectButton';
import { GlobalAlert } from '../components/common/GlobalAlert';
import AppIcon from '../components/common/LinkMintLogo';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import KakaoLoginButton from '../components/oauth/KakaoLoginButton';
import { useAlertStore } from '../hooks/useAlertStore';
import { useOAuthLogin } from '../hooks/useOAuthLogin';

interface LoginPageProps {
}

const LoginPage: React.FC<LoginPageProps> = ({ }) => {
  const { showAlert } = useAlertStore();
  const { login: oAuthLogin } = useOAuthLogin();
  // 로딩 상태 관리
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async (code: string) => {
    setIsLoggingIn(true); // 오버레이 띄우기
    try {
      await oAuthLogin('GOOGLE', code);
    } catch (error) {
      console.error("구글 로그인 에러:", error);
      setIsLoggingIn(false); // 실패 시 오버레이 제거하여 다시 버튼 누를 수 있게 함
    }
  };

  return (
    <PageContainer>
      <BackgroundShape className="shape-1" />
      <BackgroundShape className="shape-2" />
      <BackgroundShape className="shape-3" />

      {/* 로딩 중일 때만 오버레이 렌더링 */}
      {isLoggingIn && <LoadingOverlay message="구글 계정으로 로그인 중..." />}
      <GlobalAlert />
      <LoginContainer>
        {/* Logo & Header */}
        <LogoSection>
          <Logo>
            <AppIcon size={48} />
            <LogoText>Link Mint</LogoText>
          </Logo>
          <Subtitle>소셜 계정으로 간편하게 로그인하세요</Subtitle>
        </LogoSection>

        {/* OAuth View */}
        <OAuthView>
          <OAuthButtons>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <YoutubeConnectButton
                onSuccess={(code) => {
                  handleGoogleLogin(code)
                }}
              />
            </GoogleOAuthProvider>

            <KakaoLoginButton onSuccess={() => console.log('카카오 리다이렉트 시작')} />

            <OAuthButton className="github" onClick={()=>{showAlert('준비중입니다');}}>
              <span>⚫</span>
              <span>GitHub 계정으로 계속하기</span>
            </OAuthButton>

            <OAuthButton className="naver" onClick={()=>{showAlert('준비중입니다');}}>
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

export default LoginPage;

// Styled Components
export const PageContainer = styled.div`
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

export const BackgroundShape = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: white;
  animation: float 20s infinite ease-in-out;

  &.shape-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }

  &.shape-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    right: -50px;
    animation-delay: 5s;
  }

  &.shape-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    right: 10%;
    animation-delay: 10s;
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
`;

export const LoginContainer = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 440px;
  padding: 48px;
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

export const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

export const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #0F172A;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #64748B;
  line-height: 1.5;
`;

export const OAuthView = styled.div`
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const OAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
`;

export const OAuthButton = styled.button`
  height: 52px;
  border: 2px solid #E2E8F0;
  background: white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: inherit;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  .icon {
    font-size: 20px;
  }

  &.google {
    border-color: #EA4335;
    color: #EA4335;

    &:hover {
      background: #EA4335;
      color: white;
    }
  }

  &.github {
    border-color: #24292e;
    color: #24292e;

    &:hover {
      background: #24292e;
      color: white;
    }
  }

  &.kakao {
    border-color: #FEE500;
    background: #FEE500;
    color: #3C1E1E;

    &:hover {
      background: #FDD835;
      border-color: #FDD835;
    }
  }

  &.naver {
    border-color: #03C75A;
    background: #03C75A;
    color: white;

    .icon {
      font-weight: 800;
      font-size: 18px;
    }

    &:hover {
      background: #02B350;
      border-color: #02B350;
    }
  }

  &:disabled{
    background: #e8e8e8;
  }
`;


export const Footer = styled.div`
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #F1F5F9;
`;

export const FooterText = styled.p`
  font-size: 13px;
  color: #94A3B8;
  line-height: 1.6;
`;

export const FooterLink = styled.a`
  color: #2563EB;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;

  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

const EmailView = styled.div`
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    background: #F8FAFC;
    color: #0F172A;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: #0F172A;
  background: #F8FAFC;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563EB;
    background: white;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: 8px;

  a {
    font-size: 13px;
    color: #2563EB;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  color: white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  margin-top: 24px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;