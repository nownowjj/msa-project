import styled from 'styled-components';
import Header from '../components/Layout/Header';
import YoutubeContent from '../components/Layout/YoutubeContent';
import YoutubeSidebar from '../components/Layout/YoutubeSidebar';
import { useSidebarStore } from '../store/useSidebarStore';
import { MainContainer } from './DashBoard';
import VideoModal from '../components/Modal/VideoModal';
import { useState } from 'react';
import SidePanel from '../components/Layout/SidePanel';
import type { ArchiveResponse } from '../types/archive';
import { mapYoutubeToArchive } from '../types/youtube';
import { GlobalConfirm } from '../components/common/GlobalConfirm';
import { GlobalAlert } from '../components/common/GlobalAlert';

const YoutubePlayListDashBoard = () => {
  const { isOpen, closeSidebar } = useSidebarStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Partial을 허용하여 생성 중인 데이터도 담을 수 있게 합니다.
  const [selectedArchive, setSelectedArchive] = useState<Partial<ArchiveResponse> | null>(null);

  // 2. 수정 버튼 클릭 시 실행될 핸들러
  // 유튜브 아이템을 클릭했을 때 호출될 핸들러
  const handleEditYoutubeItem = (youtubeItem: any) => {
    // 1. 유튜브 데이터를 아카이브 포맷으로 변환 (Adapter)
    const archivedData = mapYoutubeToArchive(youtubeItem);
    
    // 2. 상태 저장 및 패널 오픈
    setSelectedArchive(archivedData);
    setIsPanelOpen(true);
  };

  return (
    <>
     {isOpen && <Overlay onClick={closeSidebar} />}

      <Header onAddClick={()=>{}} hideOn={true}/>
      <MainContainer $hideOn={true}>
        <YoutubeSidebar />
        <YoutubeContent
          onEditClick={handleEditYoutubeItem}
        />
      </MainContainer>

      <SidePanel
        isOpen={isPanelOpen}
        data={selectedArchive as ArchiveResponse}
        onClose={() => setIsPanelOpen(false)}
      />

      <VideoModal />

      <GlobalConfirm />
      <GlobalAlert />
    </>
  );
};

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

export default YoutubePlayListDashBoard;