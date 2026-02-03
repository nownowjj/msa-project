import { useMemo, useState } from 'react';
import styled from 'styled-components';

type Folder = {
  id: number;
  parentId: number | null;
  name: string;
  childCount: number;
};

const mockFolders: Folder[] = [
  { id: 1, parentId: null, name: "개발", childCount: 6 },
  { id: 2, parentId: 1, name: "백엔드", childCount: 2 },
  { id: 3, parentId: 2, name: "스프링부트", childCount: 0 },
  { id: 4, parentId: 2, name: "JPA", childCount: 0 },
  { id: 5, parentId: 1, name: "프론트엔드", childCount: 0 },
  { id: 6, parentId: 1, name: "인프라", childCount: 1 },
  { id: 7, parentId: 6, name: "CI/CD", childCount: 0 },
  { id: 8, parentId: 2, name: "백엔드1", childCount: 0 },
  { id: 9, parentId: 2, name: "백엔드2", childCount: 0 },
  { id: 10, parentId: 2, name: "백엔드3", childCount: 0 },
  { id: 11, parentId: 2, name: "백엔드4", childCount: 0 },
  { id: 12, parentId: 2, name: "백엔드5", childCount: 0 },
];

const Sidebar = () => {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [activeId, setActiveId] = useState<number | null>(null);


    const treeMap = useMemo(() => {
        const map = new Map<number | null, Folder[]>();
        mockFolders.forEach(f => {
        map.set(f.parentId, [...(map.get(f.parentId) || []), f]);
        });
        return map;
    }, []);

    const toggle = (id: number) => {
        setExpanded(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
        });
    };

    const renderFolders = (parentId: number | null, depth = 0) =>
        treeMap.get(parentId)?.map(folder => {
        const isExpanded = expanded.has(folder.id);
        const isActive = activeId === folder.id;
        const canExpand = folder.childCount > 0;

        return (
            <div key={folder.id}>
            <FolderItem
                active={isActive}
                style={{ paddingLeft: 12 + depth * 14 }}
                onClick={() => {
                setActiveId(folder.id);
                if (canExpand) toggle(folder.id);
                }}
            >
                <FolderIcon>
                {canExpand ? (isExpanded ? "📂" : "📁") : "📄"}
                </FolderIcon>
                <span>{folder.name}</span>
                <FolderCount>{folder.childCount}</FolderCount>
            </FolderItem>

            {isExpanded && renderFolders(folder.id, depth + 1)}
            </div>
        );
    });

  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarTitle>폴더</SidebarTitle>

        <FolderItem active={activeId === 0} onClick={() => setActiveId(0)}>
          <FolderIcon>📂</FolderIcon>
          <span>전체보기</span>
          <FolderCount>42</FolderCount>
        </FolderItem>

        {renderFolders(null)}
      </SidebarSection>

      <NewFolderButton>
        <span>+</span>
        <span>새 폴더</span>
      </NewFolderButton>
    </SidebarContainer>
  );
};


const SidebarContainer = styled.aside`
  width: 250px;
  background: #ffffff; /* var(--bg-sidebar) */
  border-right: 1px solid #e5e7eb; /* var(--border) */
  padding: 24px 0;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const SidebarSection = styled.div`
  margin-bottom: 8px;
`;

const SidebarTitle = styled.div`
  padding: 0 24px 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9ca3af; /* var(--text-muted) */
`;

const FolderCount = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6; /* var(--border-light) */
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.15s;
`;

const FolderItem = styled.div<{ active?: boolean }>`
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.15s;
  color: ${props => (props.active ? '#2563eb' : '#4b5563')};
  background: ${props => (props.active ? '#f9fafb' : 'transparent')};
  font-size: 14px;
  font-weight: ${props => (props.active ? '600' : '500')};
  position: relative;

  &:hover {
    background: #f9fafb;
    color: #111827;
    
    ${FolderCount} {
      color: #111827;
    }
  }

  /* Active 시 왼쪽 파란색 바 (Indicator) */
  ${props =>
    props.active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #2563eb;
      border-radius: 0 2px 2px 0;
    }
    
    ${FolderCount} {
      background: rgba(37, 99, 235, 0.1);
      color: #2563eb;
    }
  `}
`;

const FolderIcon = styled.span`
  font-size: 18px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FolderChildren = styled.div`
  margin-left: 18px;
`;

const NewFolderButton = styled.button`
  margin: 16px 24px 0;
  width: calc(100% - 48px);
  height: 40px;
  border: 1px dashed #e5e7eb;
  background: transparent;
  color: #4b5563;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    background: rgba(37, 99, 235, 0.05);
  }
`;

export default Sidebar;