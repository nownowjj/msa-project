import { useEffect, useRef, useState } from "react";
import { useFolderModalStore } from "../../hooks/useFolderModalStore";
import { useFolderStore } from "../../hooks/useFolderStore";
import { useFolderMutation } from "../../hooks/useFolderMutations";
import { useConfirmStore } from "../../hooks/useConfirmStore";
import type { FolderNavigationResponse } from "../../types/folder";
import styled, { css, keyframes } from "styled-components";

const RecursiveFolderItem = ({folder}: {folder: FolderNavigationResponse}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const hasChildren = folder.children && folder.children.length > 0;
  const confirm = useConfirmStore((state) => state.confirm); // 폴더 삭제 confirm 
  
  const { deleteFolder } = useFolderMutation(); // 1. mutation 훅에서 함수 가져오기
  const { activeFolder, setActiveFolder, resetActiveFolder } = useFolderStore();
  const { openEditModal , openAddSubFolderModal} = useFolderModalStore();  // 폴더 수정 Modal 


  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const menuRef = useRef<HTMLDivElement>(null); // 드롭다운 영역을 참조하기 위한 ref
  // ✅ 외부 클릭 감지 로직
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


  // 폴더 삭제
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const isConfirmed = await confirm({
      message: `[${folder.name}] 폴더를 정말 삭제할까요?`,
      confirmText: "삭제",
      cancelText: "취소"
    });

    if (isConfirmed) {
      deleteFolder(folder.id);
      resetActiveFolder()
    } 
  };
  
  // 하위 폴더 추가
  const handleAddSubFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false); // 메뉴 닫기
    openAddSubFolderModal(folder.id);
  };

  return (
    <FolderWrapper>
      <FolderRow
        active={activeFolder.id === folder.id}
        depth={folder.depth}
        onClick={() => {
            setActiveFolder(folder.id, folder.name)
          }
        }
      >
        <div className="left-section">
          <ToggleButton onClick={handleToggle} visible={hasChildren}>
            {isExpanded ? '▾' : '▸'}
          </ToggleButton>
          <span className="icon">{isExpanded ? '📂' : '📁'}</span>
          <FolderName>{folder.name}</FolderName>
        </div>

        <CountEdit ref={menuRef}>
          <span className={folder.archiveCount > 0 ? 'count' : 'zero'} >{folder.archiveCount}</span>

          <FolderEditBtn
            onClick={(e) => {
            e.stopPropagation(); // 부모 Row로 이벤트가 퍼지는 것을 막음
            setIsMenuOpen(!isMenuOpen);
          }}
          >⋯</FolderEditBtn>

          <DropdownMenu isOpen={isMenuOpen}>
            {folder.sortOrder !== 0 && 
              <MenuItem onClick={(e) => {
                e.stopPropagation();
                openEditModal(folder);
              }}>
                <MenuIcon>✏️</MenuIcon>
                <span>폴더 수정</span>
              </MenuItem>
            }

            {folder.depth < 3 && 
              <MenuItem
              onClick={handleAddSubFolder}
              >
                <MenuIcon>📁</MenuIcon>
                <span>하위 폴더 추가</span>
              </MenuItem>
            }


            {folder.sortOrder !== 0 && 
              <>
                <MenuDivider />

                <MenuItem variant="danger"
                  onClick={handleDelete}
                >
                  <MenuIcon>🗑️</MenuIcon>
                  <span>삭제</span>
                </MenuItem>
              </>
            }
          </DropdownMenu>
        </CountEdit>
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
                // activeId={activeId}
                // onSelect={onSelect}
              />
            ))}
        </ChildrenContainer>
      )}
    </FolderWrapper>
  );
};

export default RecursiveFolderItem;


const ChildrenContainer = styled.div`
  // padding-left:10px;
`;

const CountEdit = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  gap:3px;
  position:relative;
`

const FolderName = styled.span`
  font-weight:500;
  font-size:14px;
  flex:1;
  white-space: nowrap;      /* 줄바꿈 방지 */
  overflow: hidden;         /* 넘치는 부분 숨김 */
  text-overflow: ellipsis;  /* 넘치면 ... 표시 */\
  /* 부모가 flex일 때 공간 계산을 위해 최소 너비 설정 */
  min-width: 0;
`

const FolderWrapper = styled.div``;

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

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 180px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  padding: 6px;
  z-index: 1000;
  animation: ${slideDown} 0.15s ease-out;
`;

const MenuItem = styled.button<{ variant?: 'danger' }>`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: #0F172A;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  text-align: left;
  font-family: inherit;

  &:hover {
    background: #F8FAFC;
  }

  /* 위험(삭제) 스타일 */
  ${props =>
    props.variant === 'danger' &&
    css`
      color: #EF4444;
      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    `}
`;

const MenuIcon = styled.span`
  font-size: 16px;
  flex-shrink: 0;
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #F1F5F9;
  margin: 4px 0;
`;
