import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useSidebarStore } from "../../../store/useSidebarStore";
import AppIcon from "../../common/LinkMintLogo";
import { HeaderActions, PrimaryButton } from "../Header";

const ShareHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); // 드롭다운 영역을 참조하기 위한 ref
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

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


    return (
        <HeaderContainer>
            <HeaderLeft>
                <ToggleBtn onClick={toggleSidebar}>
                    <span style={{ fontSize: '21px', fontWeight: 'bold' }}>☰</span>
                </ToggleBtn>
                <Logo>
                    <AppIcon size={28} />
                    <Title>Link Mint</Title>
                </Logo>
            </HeaderLeft>

          <HeaderActions>
            <PrimaryButton>
              <span>+</span>
              <span>새 링크 추가</span>
            </PrimaryButton>
          </HeaderActions>
        </HeaderContainer>
    );
};

export default ShareHeader;

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

  @media (max-width: 768px) {
    height:55px;
    padding: 0 10px;
    gap: 0px;
  }
`;

const ToggleBtn = styled.button`
  width: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
  display:none;

  @media (max-width: 768px) {
    display:block;
  }
`

const HeaderLeft = styled.div`
  display:flex;
  gap:32px;

  @media (max-width: 768px) {
    // height:55px;
    gap:5px;
  }
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

  @media (max-width: 768px) {
    width:0px;
  }
`;


export const Title = styled.span`
  @media (max-width: 768px) {
    font-size:19px;
    font-weight:600;
  }
`