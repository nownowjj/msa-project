import { useState } from 'react';
import styled from 'styled-components';
import { GlobalAlert } from '../components/common/GlobalAlert';
import { GlobalConfirm } from '../components/common/GlobalConfirm';
import Content from '../components/Layout/Content';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import SidePanel from '../components/Layout/SidePanel';
import { FolderModal } from '../components/Modal/FolderModal';
import type { ArchiveResponse } from '../types/archive';
import { useSidebarStore } from '../store/useSidebarStore';


export interface SelectedFolder {
    id: number;
    name: string;
}

const DashBoard = () => {
    // 1. 패널 제어를 위한 상태 추가
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState<ArchiveResponse | null>(null);
    const { isOpen, closeSidebar } = useSidebarStore();

    // 2. 수정 버튼 클릭 시 실행될 핸들러
    const handleEdit = (archive: ArchiveResponse) => {
        setSelectedArchive(archive); // 선택된 데이터 저장
        setIsPanelOpen(true);        // 패널 열기
    };

    // 1. 새 링크 추가 핸들러 (데이터를 null로 설정)
    const handleAddNew = () => {
        setSelectedArchive(null); // 비어있는 상태로 만들기
        setIsPanelOpen(true);
    };


    return (
        <>
            {isOpen && <Overlay onClick={closeSidebar} />}

            <Header onAddClick={handleAddNew} />
            <MainContainer>
                <Sidebar />
                <Content
                    onEditClick={handleEdit}
                    onAddClick={handleAddNew}
                />
            </MainContainer>

            <SidePanel
                isOpen={isPanelOpen}
                data={selectedArchive}
                onClose={() => setIsPanelOpen(false)}
            />

            <MbAddBtn onClick={handleAddNew}>+</MbAddBtn>

            <FolderModal />

            {/* 전역 컨펌창 배치  */}
            <GlobalConfirm />
            <GlobalAlert />
        </>
    );
};
// const SearchContainer = styled.div<{$hideOn:boolean}>`
//   flex: 1;
//   max-width: 600px;
//   position: relative;
//   display: ${props => (props.$hideOn ? 'none' : 'block')};

export const MainContainer = styled.div<{$hideOn?:boolean}>`
    display: flex;
    margin-top: 68px;
    height: calc(100vh - 68px);

    @media (max-width: 768px) {
        margin-top: ${props => (props.$hideOn ? '55px' : '110px')};
        height: ${props => (props.$hideOn ? 'calc(100vh - 55px)' : 'calc(100vh - 110px)')};
        transition: margin-top 0.2s ease, height 0.2s ease;
    }
`

const Overlay = styled.div`
  display: none; /* 기본(PC)에서는 숨김 */

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999; /* Sidebar(1000) 바로 아래 */
    
    /* 부드러운 나타남 효과를 원한다면 아래 추가 */
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const MbAddBtn = styled.button`
  position: fixed;
  bottom: 24px;
  right: 16px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  font-weight: 300;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: all 0.3s;
  display:none;

  @media (max-width: 768px) {
    display: block;
  }
`

export default DashBoard;