import styled from 'styled-components';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Content from '../components/Layout/Content';
import { useState } from 'react';


export interface SelectedFolder {
  id: number;
  name: string;
}

const DashBoard = () => {
    const [activeFolder, setActiveFolder] = useState<SelectedFolder>({
    id: -1,
    name: '전체보기'
  });

    return (
        <>
            <Header/>
            <MainContainer>
                <Sidebar
                    activeId={activeFolder.id}
                    onSelect={(id,name) => setActiveFolder({id,name})}
                />
                <Content
                    activeFolder={activeFolder}
                />
            </MainContainer>
        </>
    );
};


const MainContainer = styled.div`
    display: flex;
    margin-top: 68px;
    height: calc(100vh - 68px);
`

export default DashBoard;