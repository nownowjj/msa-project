import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import styled from 'styled-components';
import { fetchAllFolder } from '../../api/folder';
import type { FolderNavigationResponse } from '../../types/folder';
import { useFolderModalStore } from '../../hooks/useFolderModalStore';
interface SidebarProps {
  activeId: number | null; // 현재 선택된 폴더 ID (-1은 전체보기)
  onSelect: (id: number, name: string) => void; // 폴더 클릭 시 ID를 변경할 함수
}

const Sidebar = ({activeId , onSelect}: SidebarProps) => {
  const { openCreateModal} = useFolderModalStore();
  const { data:folders , isLoading} = useQuery({
    queryKey: ['folders'],
    queryFn: fetchAllFolder
  });

  console.log(folders)

  return (
    <SidebarContainer>
      <Section>
        <SectionTitle>탐색</SectionTitle>
        <StaticItem 
          active={activeId === -1} 
          onClick={() => onSelect(-1,"전체보기")}
          depth={2}
        >
          <span className="icon">🌍</span>
          <span className="count">전체보기</span>
        </StaticItem>

      </Section>

      <Section>
        <SectionTitle>내 폴더</SectionTitle>
        {isLoading ? (
          <LoadingText>폴더 불러오는 중...</LoadingText>
        ) : (
          folders?.map((folder) => (
            <RecursiveFolderItem
              key={folder.id}
              folder={folder}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))
        )}
      </Section>

      <NewFolderButton onClick={openCreateModal}>+ 새 폴더</NewFolderButton>
    </SidebarContainer>
  );
};

// 재귀 컴포넌트
const RecursiveFolderItem = ({ 
  folder, 
  activeId, 
  onSelect 
}: { 
  folder: FolderNavigationResponse; 
  activeId: number | null;
  onSelect: (id: number, name: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <FolderWrapper>
      <FolderRow 
        active={activeId === folder.id} 
        depth={folder.depth}
        onClick={() => onSelect(folder.id,folder.name)}
      >
        <div className="left-section">
          <ToggleButton onClick={handleToggle} visible={hasChildren}>
            {isExpanded ? '▾' : '▸'}
          </ToggleButton>
          <span className="icon">{isExpanded ? '📂' : '📁'}</span>
          <span className="name">{folder.name}</span>
        </div>
        <span className={folder.archiveCount > 0  ? 'count' : 'zero'} >{folder.archiveCount}</span>
      </FolderRow>

      {/* 재귀 호출: 열려있고 자식이 있을 때만 */}
      {isExpanded && hasChildren && (
        <ChildrenContainer>
          {folder.children
            .sort((a, b) => a.sortOrder - b.sortOrder) // 정렬 보장
            .map((child) => (
              <RecursiveFolderItem
                key={child.id}
                folder={child}
                activeId={activeId}
                onSelect={onSelect}
              />
            ))}
        </ChildrenContainer>
      )}
    </FolderWrapper>
  );
};

export default Sidebar;

/* Styled Components */
const SidebarContainer = styled.div`
  width: 260px;
  background: #f8f9fa;
  height: calc(100vh - 68px);
  padding: 20px 10px;
  border-right: 1px solid #e9ecef;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  color: #adb5bd;
  margin-bottom: 8px;
  padding-left: 12px;
  text-transform: uppercase;
`;

const FolderRow = styled.div<{ active: boolean; depth: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px;
  padding-left: ${props => (props.depth - 1) * 12 + 12}px;
  cursor: pointer;
  border-radius: 6px;
  background: ${props => props.active ? '#e7f5ff' : 'transparent'};
  color: ${props => props.active ? '#1971c2' : '#495057'};

  &:hover {
    background: #f1f3f5;
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .count {
    font-size: 12px;
    color: black;
  }

  .zero{
    font-size: 11px;
    color: #ced4da;
  }
`;

const ToggleButton = styled.button<{ visible: boolean }>`
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 16px;
  color: #adb5bd;
`;

const ChildrenContainer = styled.div`
  // padding-left:10px;
`;
const StaticItem = styled(FolderRow)``;
const FolderWrapper = styled.div``;
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
