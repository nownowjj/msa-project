import styled from 'styled-components';
import { type SharedFolderResponse } from '../../../api/share';
import { useSidebarStore } from '../../../store/useSidebarStore';
import AppIcon from '../../common/LinkMintLogo';
import { CountEdit, FolderName, ToggleButton } from '../../Folder/RecursiveFolderItem';
import { Title } from '../Header';


const ShareSidebar = ({ folderInfo }: { folderInfo?: SharedFolderResponse }) => {
  const { isOpen } = useSidebarStore();


  return (
    <SidebarContainer $isOpen={isOpen}>

      <MoblieSection>
        <Row>
          <AppIcon size={30} />
          <Title>Link Mint</Title>
        </Row>
      </MoblieSection>



      <Section $isMaxHeight={true}>
        <SectionTitle>공유받은 폴더</SectionTitle>

        <div>
          <FolderRow depth={0}>
            <div className="left-section">
              <ToggleButton $visible={false}>▸</ToggleButton>
              <span className="icon">📁</span>
              <FolderName>{folderInfo?.folderName}</FolderName>
            </div>

            <CountEdit>
              <span className="count">{folderInfo?.archives.page.totalElements}</span>
            </CountEdit>
          </FolderRow>
        </div>

      </Section>
    </SidebarContainer>
  );
};


export default ShareSidebar;

/* Styled Components */
const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  width: 260px;
  background: #f8f9fa;
  height: calc(100vh - 68px);
  padding: 20px 10px;
  border-right: 1px solid #e9ecef;

  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 모바일 대응 (주로 768px 미만) */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: -260px;
    z-index: 1000;
    height: 100vh;
    
    /* 닫혀있을 때 화면 밖으로 밀어냄 */
    left: ${({ $isOpen }) => ($isOpen ? '0px' : '-260px')};
  }
`;

const FolderEditBtn = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #64748B;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.15s;
  padding: 0;
  display: none;

  &:hover{
    background: #E2E8F0;
    color: #0F172A;
  }
`

const Section = styled.div<{ $isMaxHeight?: boolean }>`
  max-height: ${props => (props.$isMaxHeight ? '550px;' : 'none;')};
  min-height: ${props => (props.$isMaxHeight ? '550px;' : 'none;')};
  margin-bottom: 24px;
  overflow-y: auto; /* scroll 대신 auto를 권장합니다 (필요할 때만 노출) */
  /* 모바일 View (768px 이하) 대응 */
  @media (max-width: 768px) {
    max-height: ${props => (props.$isMaxHeight ? '250px' : 'none')};
    min-height: ${props => (props.$isMaxHeight ? '250px' : 'none')};
  }
`;

const MoblieSection = styled.div`
  width: calc(100% + 20px);
  margin-left:-10px;
  padding:0 10px 10px 10px;
  border-bottom: var(--border);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom:10px;
  display:none;

  @media (max-width: 768px) {
    display:block;
  }
`

const Row = styled.div`
  display:flex;
  gap:10px;
  padding-bottom:10px;
  align-items: center;
`

const SectionTitle = styled.h3`
  font-size: 12px;
  color: #adb5bd;
  margin-bottom: 8px;
  padding-left: 12px;
  text-transform: uppercase;
`;

const FolderRow = styled.div<{ active?: boolean; depth: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px;
  padding-left: ${props => (props.depth - 1) * 12 + 12}px;
  cursor: pointer;
  border-radius: 6px;
  background: ${props => props.active ? '#e7f5ff' : 'transparent'};
  color: ${props => props.active ? '#1971c2' : '#495057'};
  gap:4px;

  &:hover {
    background: #f1f3f5;

    ${FolderEditBtn} {
      display:block;
    }
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .count {
    font-size: 12px;
    color: black;
    &.all{
      font-size:14px;
      font-weight:500;
    }
  }

  .zero{
    font-size: 11px;
    color: #ced4da;
  }
`;


const StaticItem = styled(FolderRow)``;
const LoadingText = styled.div`padding: 12px; font-size: 13px; color: #868e96;`;
const NewFolderButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px dashed #ced4da;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #868e96;
  &:hover { background: #f8f9fa; }
`;