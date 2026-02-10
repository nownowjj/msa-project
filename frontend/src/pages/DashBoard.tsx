import styled from 'styled-components';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Content from '../components/Layout/Content';
import { useState } from 'react';
import SidePanel from '../components/Layout/SidePanel';
import type { ArchiveResponse } from '../types/archive';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteArchive } from '../api/archive';


export interface SelectedFolder {
  id: number;
  name: string;
}

const DashBoard = () => {
    const [activeFolder, setActiveFolder] = useState<SelectedFolder>({
        id: -1,
        name: '전체보기'
    });

    // 1. 패널 제어를 위한 상태 추가
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState<ArchiveResponse | null>(null);

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
            <Header onAddClick={handleAddNew}/>
            <MainContainer>
                <Sidebar
                    activeId={activeFolder.id}
                    onSelect={(id,name) => setActiveFolder({id,name})}
                />
                <Content
                    activeFolder={activeFolder}
                    onEditClick={handleEdit}
                />
            </MainContainer>

            {/* 4. SidePanel에 상태와 닫기 함수 전달 */}
            <SidePanel 
                isOpen={isPanelOpen} 
                data={selectedArchive} 
                onClose={() => setIsPanelOpen(false)} 
            />
        </>
    );
};


const MainContainer = styled.div`
    display: flex;
    margin-top: 68px;
    height: calc(100vh - 68px);
`

export default DashBoard;