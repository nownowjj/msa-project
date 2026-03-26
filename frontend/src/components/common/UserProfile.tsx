import styled from "styled-components";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

interface UserProfileProps {
  onClick?: () => void; // 클릭 이벤트는 선택적(optional)으로 처리
  children?: React.ReactNode; // 내부 'U' 같은 텍스트나 아이콘
  size?: number;
}

const UserProfile = ({ onClick,  size = 38 }: UserProfileProps) => {
  const profileUrl = useAuthStore((state) => state.user?.picture);
  const [imageError, setImageError] = useState(false);
  const isImageValid = !!profileUrl && !imageError;

  return (
    <UserAvatar
      onClick={onClick}
      $size={size}
      $isImageValid={isImageValid} // 스타일 분기용 props 전달
    >
      {/* ✅ 4. 이미지가 유효하면 img 태그를, 아니면 Fallback UI를 보여줍니다. */}
      {isImageValid ? (
        <img
          src={profileUrl!} // TS non-null assertion
          alt="User Profile"
          onError={() => setImageError(true)} // 로드 실패 시 Fallback으로 전환
        />
      ) : (
        // ✅ 5. 전달받은 children("U" 등)이 있으면 보여주고, 없으면 이름의 첫 글자 등을 Fallback으로 사용
        "U"
      )}
    </UserAvatar>
  );
};

export default UserProfile;

/* ================== 스타일 정의 (Styled-Components) ================== */

// 스타일 Props 타입 정의
interface AvatarProps {
  $size: number;
  $isImageValid: boolean;
}

const UserAvatar = styled.div<AvatarProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  
  // ✅ 6. 이미지가 있을 때와 없을 때 배경/테두리 스타일 분기
  background: ${({ $isImageValid }) =>
    $isImageValid
      ? '#fff' // 이미지가 있을 땐 배경색 하얗게
      : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' // Fallback 그라디언트
  };
  
  border: ${({ $isImageValid }) =>
    $isImageValid
      ? '1px solid #e5e7eb' // 이미지가 있을 땐 옅은 회색 테두리
      : 'none'
  };

  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${({ $size }) => ($size / 2.7).toFixed(0)}px; // 사이즈에 비례하는 폰트 크기
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  box-sizing: border-box;
  overflow: hidden; // ✅ 7. 내부 img 태그가 border-radius를 벗어나지 않게 처리

  /* ✅ 8. 내부 img 태그 스타일 정의 */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; // ✅ 9. 비율 유지하며 가득 채우기 (가장 중요)
    border-radius: 50%; // ✅ 10. 이중으로 적용해서 확실하게 둥글게
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); // hover 효과 강화
  }

  &:active {
    transform: scale(0.95);
  }
`;