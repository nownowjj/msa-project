import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api/api';
import YoutubeConnectButton from '../components/YoutubeConnectButton';

interface LoginPageProps {
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  onKakaoLogin?: () => void;
  onNaverLogin?: () => void;
  onEmailLogin?: (email: string, password: string) => void;
}

type ViewMode = 'oauth' | 'email';

const LoginPage: React.FC<LoginPageProps> = ({
  onGoogleLogin,
  onGithubLogin,
  onKakaoLogin,
  onNaverLogin,
  onEmailLogin,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('oauth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewMode === 'email') {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [viewMode]);


  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    onGoogleLogin?.();
    // window.location.href = '/auth/google';
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmailLogin?.(email, password);
  };

  const handleGithubLogin = () => {
    onGithubLogin?.();
    // window.location.href = '/auth/github';
  };

  const handleKakaoLogin = () => {
    onKakaoLogin?.();
    // window.location.href = '/auth/kakao';
  };

  const handleNaverLogin = () => {
    onNaverLogin?.();
    // window.location.href = '/auth/naver';
  };


  const useGoogleLoginSuccess= async (code: String)=>{
    try {
      // 1. API 호출
      const res = await api.post('/auth/google', { code });

      // 2. 스토리지에 토큰 저장
      localStorage.setItem('token', res.data.accessToken);

      // 3. 페이지 이동 및 히스토리 교체 (가장 중요)
      // replace: true를 설정하면 현재 페이지(login)가 히스토리 스택에서 삭제됩니다.
      navigate('/board', { replace: true });

      // 성공 알림 (이동 후에 띄우거나 이동 직전에 띄움)
      console.log('Google 로그인 성공');
    } catch (error) {
        console.error('로그인 중 에러 발생:', error);
        alert('로그인에 실패했습니다.');
      }
    }
  

  return (
    <PageContainer>
      <BackgroundShape className="shape-1" />
      <BackgroundShape className="shape-2" />
      <BackgroundShape className="shape-3" />

      <LoginContainer>
        {/* Logo & Header */}
        <LogoSection>
          <Logo>
            <LogoIcon>A</LogoIcon>
            <LogoText>msa-project</LogoText>
          </Logo>
          {/* <WelcomeText>시작하기</WelcomeText> */}
          <Subtitle>    
            {viewMode === 'oauth' 
              ? '소셜 계정으로 간편하게 로그인하세요' 
              : '계정 정보를 입력해주세요'}
          </Subtitle>
        </LogoSection>

        {/* OAuth View */}
        {viewMode === 'oauth' && (
          <OAuthView>
            <OAuthButtons>
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <YoutubeConnectButton
                  onSuccess={(code) => {
                    useGoogleLoginSuccess(code);
                  }}
                />
              </GoogleOAuthProvider>

              <OAuthButton className="github" onClick={handleGithubLogin}>
                <span>⚫</span>
                <span>GitHub 계정으로 계속하기</span>
              </OAuthButton>

              <OAuthButton className="kakao" onClick={handleKakaoLogin}>
                <span>💬</span>
                <span>카카오 계정으로 계속하기</span>
              </OAuthButton>

              <OAuthButton className="naver" onClick={handleNaverLogin}>
                <span style={{ fontWeight: 800 }}>N</span>
                <span>네이버 계정으로 계속하기</span>
              </OAuthButton>
            </OAuthButtons>

            {/* <Divider>
              <DividerLine />
              <DividerText>또는</DividerText>
              <DividerLine />
            </Divider> */}

            {/* <EmailButton onClick={() => setViewMode('email')}>
              <span>📧</span>
              <span>이메일로 로그인</span>
            </EmailButton> */}

            {/* <Features>
              <FeatureItem>
                <span>🔒</span>
                <span>안전한 로그인</span>
              </FeatureItem>
              <FeatureItem>
                <span>⚡</span>
                <span>빠른 시작</span>
              </FeatureItem>
              <FeatureItem>
                <span>🌐</span>
                <span>모든 기기 동기화</span>
              </FeatureItem>
              <FeatureItem>
                <span>✨</span>
                <span>무료 사용</span>
              </FeatureItem>
            </Features> */}
          </OAuthView>
        )}

        {/* Email View */}
        {viewMode === 'email' && (
          <EmailView>
            <BackButton onClick={() => setViewMode('oauth')}>
              <span>←</span>
              <span>다른 방법으로 로그인</span>
            </BackButton>

            <form onSubmit={handleEmailSubmit}>
              <FormGroup>
                <FormLabel>이메일</FormLabel>
                <FormInput
                  ref={emailInputRef}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>비밀번호</FormLabel>
                <FormInput
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <ForgotPassword>
                  <a href="#">비밀번호를 잊으셨나요?</a>
                </ForgotPassword>
              </FormGroup>

              <SubmitButton type="submit">
                로그인
              </SubmitButton>
            </form>

            {/* <Divider>
              <DividerLine />
              <DividerText>또는</DividerText>
              <DividerLine />
            </Divider>

            <OAuthButtons>
              <OAuthButton className="google" onClick={handleGoogleLogin}>
                <span>🔍</span>
                <span>Google로 계속하기</span>
              </OAuthButton>

              <OAuthButton className="github" onClick={handleGithubLogin}>
                <span>⚫</span>
                <span>GitHub로 계속하기</span>
              </OAuthButton>
            </OAuthButtons> */}
          </EmailView>
        )}

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

const BackgroundShape = styled.div`
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

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 24px;
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #0F172A;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const WelcomeText = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #64748B;
  line-height: 1.5;
`;

const OAuthView = styled.div`
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const OAuthButtons = styled.div`
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 32px 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #E2E8F0;
`;

const DividerText = styled.span`
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
`;

const EmailButton = styled.button`
  width: 100%;
  height: 52px;
  border: 2px solid #2563EB;
  background: white;
  color: #2563EB;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #2563EB;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
  }
`;

const Features = styled.div`
  margin-top: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748B;

  .icon {
    font-size: 16px;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #F1F5F9;
`;

const FooterText = styled.p`
  font-size: 13px;
  color: #94A3B8;
  line-height: 1.6;
`;

const FooterLink = styled.a`
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