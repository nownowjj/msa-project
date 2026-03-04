import styled from "styled-components";

interface UserProfileProps {
  onClick?: () => void; // 클릭 이벤트는 선택적(optional)으로 처리
  children?: React.ReactNode; // 내부 'U' 같은 텍스트나 아이콘
  size?: number;
}

const UserProfile = ({ onClick, children ,size=38 }: UserProfileProps) => {
    return (
      <UserAvatar onClick={onClick} $size={size}>
        {children || "U"} {/* 전달받은 내용이 없으면 기본값 'U' 표시 */}
    </UserAvatar>
    );
};

export default UserProfile;

const UserAvatar = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s;
  position:relative;
  box-sizing:border-box;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95); /* 클릭했을 때 눌리는 느낌 추가 */
  }
`;