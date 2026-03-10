// import BackButton from './BackButton';
import { useNavigate } from 'react-router-dom';
import { LoginContainer, PageContainer } from './Login';
import styled from 'styled-components';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <LoginContainer>
        <Header>
          <BackButton onClick={()=> {navigate(-1)}} title="목록으로 돌아가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </BackButton>
          <h2 >서비스 이용약관</h2>
        </Header>
        
        <h3>제 1 조 (목적)</h3>
        <p>본 약관은 "MSA Project"에서 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

        <h3>제 2 조 (이용자의 의무)</h3>
        <p>이용자는 서비스를 이용할 때 다음 각 호의 행위를 하여서는 안 됩니다.</p>
        <ul>
          <li>타인의 서비스 계정을 부정하게 사용하는 행위</li>
          <li>서비스의 정상적인 운영을 방해하는 행위</li>
          <li>기타 관계 법령에 위배되는 행위</li>
        </ul>

        <h3>제 3 조 (책임의 제한)</h3>
        <p>본 서비스는 개인 프로젝트 및 테스트 목적으로 제공되므로, 서비스 이용 중 발생한 데이터의 손실이나 중단에 대해 운영자는 책임을 지지 않습니다.</p>

        <h3>제 4 조 (준거법 및 재판관할)</h3>
        <p>서비스 이용과 관련하여 발생한 분쟁에 대해서는 대한민국 법령을 적용합니다.</p>

        <p style={{ marginTop: '40px', fontSize: '0.9em', color: '#666' }}>시행일자: 2026년 2월 19일</p>
      </LoginContainer>
    </PageContainer>
  );
};

export const Header = styled.header`
  display:flex;
  margin-bottom:15px;
`
export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  &:hover { color: #111827; }

  display:flex;
`;

export default Terms;