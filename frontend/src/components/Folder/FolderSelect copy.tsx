
import Select from 'react-select';
import type { SingleValue } from 'react-select';

// 1. 타입 정의
export interface FolderOption {
  value: number;
  label: string;
  displayLabel: string;
  depth: number;
}

interface FolderSelectProps {
  folders: any[]; // 부모로부터 받은 원본 폴더 데이터
  currentFolderId?: number ;
  onChange: (folderId: number) => void;
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
    backgroundColor: state.isFocused ? '#e7f5ff' : 'transparent',
    color: state.isFocused ? '#4dabf7' : '#212529',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '4px',
    margin: '2px 0'
  }),
  // 메뉴 컨테이너 자체의 스타일 (그림자 등)
  menu: (base: any) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 9999
  })
};

const FolderSelect = ({ folders, currentFolderId, onChange }: FolderSelectProps) => {
  // 3. 데이터 가공 로직 (Flatten)
  const flattenFolders = (list: any[], depth = 0): FolderOption[] => {
    let flat: FolderOption[] = [];
    list.forEach(folder => {
      flat.push({
        value: folder.id,
        label: `${folder.name}-${folder.id}`,
        displayLabel: `${'\u00A0'.repeat(depth * 3)} 📁 ${folder.name}`,
        depth: depth
      });
      if (folder.children) {
        flat = [...flat, ...flattenFolders(folder.children, depth + 1)];
      }
    });
    return flat;
  };

  const options = [
    // { value: 'default', label: '기본', displayLabel: '📂 기본', depth: 0 },
    ...flattenFolders(folders)
  ];

  const selectedValue = options.find(opt => opt.value === currentFolderId) || options[0];

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
        placeholder: "폴더를 선택하세요",
        // menuPortalTarget: document.body, // 메뉴가 사이드바에 가려지는 것 방지
        styles: {
          ...customStyles,
          menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
        }
      } as any)}
    />
  );
};

export default FolderSelect;