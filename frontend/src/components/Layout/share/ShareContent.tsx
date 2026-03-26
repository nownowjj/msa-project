import { useEffect } from "react";
import { useInView } from 'react-intersection-observer'; // 1. Hook 임포트
import styled, { keyframes } from "styled-components";
import type { ArchiveResponse } from "../../../types/archive";
import ArchiveCard from "../../Archive/ArchiveCard";

// 1. Props 타입 정의 수정
interface ShareContentProps {
  archives: ArchiveResponse[];
  accessRole: 'VIEWER' | 'EDITOR';
  onEditClick: (item: ArchiveResponse) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  folderName?: string;
  totalElements?: number;
}

const ShareContent = ({
  archives,
  accessRole,
  onEditClick,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  folderName,
  totalElements,
}: ShareContentProps) => {
  
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // ✅ 사용자가 바닥에 도달했는지 감시하여 다음 페이지 호출
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <MainContent>
      <ContentHeader>
        <ContentTitle>
          {folderName || '폴더'}
          <TotalCount>{totalElements || 0}</TotalCount>
        </ContentTitle>
      </ContentHeader>

      <CardsGrid>
        {/* 1. 데이터가 없을 때 (Empty State) */}
        {archives.length === 0 && (
          <EmptyWrapper>
            <EmptyIcon>📁</EmptyIcon>
            <EmptyTitle>'아카이브가 비어 있습니다'</EmptyTitle>
            <EmptyDescription>
              {folderName ? `'${folderName}' 폴더가 비어있습니다.` : '폴더가 비어있습니다.'}
            </EmptyDescription>
          </EmptyWrapper>
        )}

        {/* 2. 아카이브 카드 렌더링 */}
        {archives.map((item) => (
          <ArchiveCard
            key={item.id}
            item={item}
            // EDITOR 권한일 때만 수정 함수 연결
            onEdit={() => accessRole === 'EDITOR' && onEditClick(item)}
            // 카드 UI 내부에서도 권한에 따라 편집 버튼 노출 여부 결정 가능
            // isEditable={accessRole === 'EDITOR'} 
          />
        ))}
      </CardsGrid>

      {/* 3. 무한 스크롤 트리거 요소 */}
      {hasNextPage && (
        <div ref={ref} style={{ height: '50px', margin: '20px 0', textAlign: 'center' }}>
          {isFetchingNextPage && <LoadingText>추가 데이터를 불러오는 중...</LoadingText>}
        </div>
      )}
    </MainContent>
  );
};
const MainContent = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background-color: #f9fafb;

  @media (max-width: 768px) {
    padding : 16px
  }
`;

const ContentHeader = styled.div`
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const ContentTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const TotalCount = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #111827; // 약간 흐리게 처리해서 제목과 구분
  
  &::before {
    content: "(";
  }
  &::after {
    content: ")";
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ViewOptions = styled.div`
  display: flex;
  gap: 8px;
  background: #ffffff;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ViewBtn = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: none;
  background: ${props => (props.active ? '#2563eb' : 'transparent')};
  color: ${props => (props.active ? 'white' : '#9ca3af')};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    color: ${props => (props.active ? 'white' : '#111827')};
  }
`;

// 2. 카드 그리드 및 개별 카드 스타일
const CardsGrid = styled.div`
  display: grid;
  justify-content: center;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 340px));
  }
`;



// ----------------

const EmptyWrapper = styled.div`
  grid-column: 1 / -1; /* 그리드 전체 가로 칸을 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: #ffffff;
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  margin: 20px 0;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  filter: grayscale(1); /* 무채색 느낌으로 강조 빼기 */
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  color: #495057;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #adb5bd;
  margin-bottom: 24px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #339af0;
  }
`;


// ----------
// 1. 회전 애니메이션 정의
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 2. 로딩 컨테이너 (EmptyWrapper와 유사하게 그리드 전체 차지)
const LoadingWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  gap: 16px;
`;

// 3. 스피너 (회전하는 원형 아이콘)
const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f1f3f5;
  border-top: 4px solid #4dabf7; // 포인트 컬러
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

// 4. 로딩 메시지 텍스트
const LoadingText = styled.p`
  font-size: 15px;
  color: #868e96;
  font-weight: 500;
`;


export default ShareContent;