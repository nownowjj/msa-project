import styled from 'styled-components';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Content from '../components/Layout/Content';

const DashBoard = () => {
    return (
        <>
            <Header/>
            <MainContainer>
                <Sidebar/>
                <Content/>
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