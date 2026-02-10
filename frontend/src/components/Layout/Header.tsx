import styled from "styled-components";

const Header = ({ onAddClick }: { onAddClick: () => void }) => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>C</LogoIcon>
        <span>Curation Board</span>
      </Logo>

      <SearchContainer>
        <SearchIcon>🔍</SearchIcon>
        <SearchBar type="text" placeholder="검색어, 태그, URL로 검색..." />
      </SearchContainer>

      <HeaderActions>
        <PrimaryButton onClick={onAddClick}>
          <span>+</span>
          <span>새 링크 추가</span>
        </PrimaryButton>
        <UserAvatar>K</UserAvatar>
      </HeaderActions>
    </HeaderContainer>
  );
};

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
  padding: 0 32px;
  gap: 32px;
  z-index: 100;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* var(--shadow-sm) */
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  cursor: pointer;
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

  &:hover {
    transform: scale(1.05);
  }
`;

export default Header;