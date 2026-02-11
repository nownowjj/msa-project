import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000; /* 최상단 보장 */
  animation: ${fadeIn} 0.15s ease-out;
`;

export const Dialog = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.2s ease-out;
`;

export const Message = styled.p`
  font-size: 15px;
  color: #0F172A;
  line-height: 1.5;
  margin-bottom: 20px;
  text-align: center;
  white-space: pre-wrap; /* \n 줄바꿈 허용 */
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const CancelButton = styled.button`
  flex: 1;
  height: 40px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  color: #64748B;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #F8FAFC; }
`;

export const ConfirmButton = styled.button`
  flex: 1;
  height: 40px;
  border: none;
  background: #EF4444; /* 삭제 위주라면 Red, 일반적이라면 포인트 컬러 */
  color: #FFFFFF;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #DC2626; }
`;