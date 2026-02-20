import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { useConfirmStore } from "../../hooks/useConfirmStore";
import { useAlertStore } from "../../hooks/useAlertStore";
import { useQueryClient } from "@tanstack/react-query";

const Header = ({ onAddClick }: { onAddClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // 드롭다운 영역을 참조하기 위한 ref
  const navigate = useNavigate();
  const confirm = useConfirmStore((state) => state.confirm);
  const { showAlert } = useAlertStore();
  const queryClient = useQueryClient();
  
  // ✅ 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 클릭된 요소가 menuRef(드롭다운 포함 영역) 안에 없으면 닫기
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

    // ✅ 로그아웃 핸들러
    const handleLogout = async () => {      
      const isConfirmed = await confirm({
        message: `정말 로그아웃 하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소"
      });

      if (isConfirmed) {
        queryClient.clear();
        localStorage.removeItem('token');
        await showAlert('로그아웃 되었습니다.');

        navigate('/login', { replace: true });
      } 
      
    };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <Logo>
          <LogoIcon>A</LogoIcon>
          <span>나만의 저장소</span>
        </Logo>

        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchBar type="text" placeholder="검색어, 태그, URL로 검색..." />
        </SearchContainer>
      </HeaderLeft>
      <HeaderActions ref={menuRef}>
        <PrimaryButton onClick={onAddClick}>
          <span>+</span>
          <span>새 링크 추가</span>
        </PrimaryButton>
        <UserAvatar onClick={()=> setIsMenuOpen(!isMenuOpen)}>U</UserAvatar>

        <DropdownMenu isOpen={isMenuOpen}>
              <MenuItem variant="danger" onClick={handleLogout}>
                <MenuIcon>🗑️</MenuIcon>
                <span>로그아웃</span>
              </MenuItem>
          </DropdownMenu>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  background: var(--bg-card) ;
  border-bottom: var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  gap: 32px;
  z-index: 100;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* var(--shadow-sm) */
`;

const HeaderLeft = styled.div`
  display:flex;
  gap:32px;
`

const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  cursor: pointer;
  width:228px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  position: relative;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px 0 44px;
  border: 1px solid #e5e7eb; /* var(--border) */
  border-radius: 8px; /* var(--radius-sm) */
  font-size: 15px;
  background: #f9fafb; /* var(--bg-main) */
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; /* var(--text-muted) */
  font-size: 18px;
  pointer-events: none;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
`;

const PrimaryButton = styled.button`
  height: 44px;
  padding: 0 24px;
  background: #2563eb; /* var(--primary) */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;

  &:hover {
    background: #1d4ed8; /* var(--primary-hover) */
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* var(--shadow-md) */
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserAvatar = styled.div`
  width: 38px;
  height: 38px;
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

  &:hover {
    transform: scale(1.05);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


const DropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 180px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  padding: 6px;
  z-index: 1000;
  animation: ${slideDown} 0.15s ease-out;
`;

const MenuItem = styled.button<{ variant?: 'danger' }>`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: #0F172A;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  text-align: left;
  font-family: inherit;

  &:hover {
    background: #F8FAFC;
  }

  /* 위험(삭제) 스타일 */
  ${props =>
    props.variant === 'danger' &&
    css`
      color: #EF4444;
      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    `}
`;

const MenuIcon = styled.span`
  font-size: 16px;
  flex-shrink: 0;
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #F1F5F9;
  margin: 4px 0;
`;