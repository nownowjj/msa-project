import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7); // 반투명 배경
  backdrop-filter: blur(4px); // 배경 살짝 흐리게 (트렌디한 효과)
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db; // 포인트 컬러
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

export const LoadingOverlay = ({ message }: { message?: string }) => (
  <Overlay>
    <Spinner />
    {message && <p style={{ marginTop: '20px', fontWeight: 600 }}>{message}</p>}
  </Overlay>
);