import BackButton from "./BackButton";
import { LoginContainer, PageContainer } from "./Login";

const Privacy = () => {
  return (
    <PageContainer>
      <LoginContainer>
        <BackButton></BackButton>
        <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>개인정보처리방침</h1>
        <p>본 서비스(이하 '서비스')는 사용자의 개인정보를 중요시하며, 구글(Google) 로그인 서비스 제공을 위해 아래와 같이 최소한의 개인정보를 수집하고 이용합니다.</p>

        <h3>1. 수집하는 개인정보 항목</h3>
        <ul>
          <li>필수 항목: 구글 계정 이메일 주소, 이름(닉네임), 프로필 사진</li>
        </ul>

        <h3>2. 개인정보의 수집 및 이용 목적</h3>
        <p>수집된 정보는 오직 사용자의 서비스 로그인 및 본인 확인을 위한 용도로만 사용됩니다.</p>

        <h3>3. 개인정보의 보유 및 이용 기간</h3>
        <p>사용자가 서비스에서 탈퇴하거나 개인정보 삭제를 요청할 경우, 수집된 정보는 즉시 파기됩니다.</p>

        <h3>4. 개인정보의 제3자 제공</h3>
        <p>서비스는 사용자의 정보를 외부에 판매하거나 동의 없이 제3자에게 제공하지 않습니다.</p>

        <p style={{ marginTop: '40px', fontSize: '0.9em', color: '#666' }}>시행일자: 2026년 2월 19일</p>
      </LoginContainer>
    </PageContainer>
  );
};

export default Privacy;