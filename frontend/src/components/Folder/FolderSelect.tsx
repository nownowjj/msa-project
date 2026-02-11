
import Select from 'react-select';
import type { SingleValue } from 'react-select';
import type { FolderNavigationResponse } from '../../types/folder';

// 1. 타입 정의
export interface FolderOption {
  value: number;
  label: string;
  displayLabel: string;
  depth: number;
  isDisabled: boolean;
}

interface FolderSelectProps {
  folders: FolderNavigationResponse[];
  currentFolderId: number;
  onChange: (folderId: number) => void;
  showRootOption?: boolean; // 최상위(Root) 선택지 표시 여부
  excludeId?: number;       // 수정 모드일 때 자신과 하위 폴더 제외
  isDisabled: boolean;
}

// 2. 스타일 정의
const customStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: '8px',
    padding: '2px',
    border: '1px solid #e9ecef',
    background: '#f8f9fa',
    boxShadow: 'none',
    '&:hover': { border: '1px solid #4dabf7' }
  }),
  // ✅ 메뉴 리스트(내부 스크롤 영역) 스타일 추가
  menuList: (base: any) => ({
    ...base,
    maxHeight: '150px', // 최대 높이 지정
    overflowY: 'auto',   // 내용이 많아지면 스크롤 발생
    padding: '4px',      // 내부 여유 공간
    
    /* 스크롤바 커스텀 (선택 사항) */
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e9ecef',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#adb5bd',
    }
  }),
  option: (base: any, state: any) => ({
    ...base,
    // ✅ isDisabled일 때와 아닐 때를 구분하여 스타일 적용
    backgroundColor: state.isDisabled 
      ? 'transparent' 
      : state.isFocused ? '#e7f5ff' : 'transparent',

    color: state.isDisabled 
      ? '#adb5bd'  // 비활성화 시 연한 회색
      : state.isFocused ? '#4dabf7' : '#212529',

    cursor: state.isDisabled ? 'not-allowed' : 'pointer', // 마우스 커서 변경

    fontSize: '14px',
    borderRadius: '4px',
    margin: '2px 0',

    // ✅ 비활성화된 옵션에 마우스를 올렸을 때 배경색 변화 방지
    ':active': {
      ...base[':active'],
      backgroundColor: state.isDisabled ? 'transparent' : '#e7f5ff',
    },
  }),
  // 메뉴 컨테이너 자체의 스타일 (그림자 등)
  menu: (base: any) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 9999
  })
};

const FolderSelect = ({ folders, currentFolderId, onChange, showRootOption, excludeId , isDisabled}: FolderSelectProps) => {
  // 3. 데이터 가공 로직 (Flatten)
  const flattenFolders = (list: FolderNavigationResponse[], depth = 0): FolderOption[] => {
    let flat: FolderOption[] = [];

    list.forEach(folder => {
      // ✅ excludeId가 있고, 현재 폴더가 그 ID와 같다면 이 가지(Branch) 전체를 스킵
      if (excludeId && folder.id === excludeId) return;

      flat.push({
        value: folder.id,
        label: `${folder.name}-${folder.id}`,
        displayLabel: `${'\u00A0'.repeat(depth * 3)} 📁 ${folder.name}`,
        depth: depth,
        isDisabled: depth >= 3
      });
      if (folder.children) {
        flat = [...flat, ...flattenFolders(folder.children, depth + 1)];
      }
    });
    return flat;
  };

  const options = [
    ...(showRootOption ? [{ value: 0, label: '최상위 폴더', displayLabel: '📂 최상위 폴더 (Root)', depth: 0 }] : []),
    ...flattenFolders(folders)
  ];

  const selectedValue = options.find(opt => opt.value === currentFolderId) || null;

  return (
    <Select
      {...({
        options,
        value: selectedValue,
        formatOptionLabel: (option: FolderOption, { context }: any) => 
          context === 'menu' ? option.displayLabel : option.label,
        onChange: (newValue: SingleValue<FolderOption>) => {
          if (newValue) onChange(newValue.value);
        },
        isSearchable: false,
        isDisabled : isDisabled,
        placeholder: "폴더를 선택하세요",
        styles: {
          ...customStyles, // 기본 스타일 적용
          // ✅ showRootOption에 따라 maxHeight 동적 변경
          menuList: (base: any) => ({
            ...base,
            ...customStyles.menuList(base), // 기존 menuList 스타일(스크롤바 등) 유지
            maxHeight: showRootOption ? '300px' : '150px', // 조건부 높이 설정
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
        }
      } as any)}
    />
  );
};

export default FolderSelect;