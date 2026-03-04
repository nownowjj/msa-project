import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer'; // 1. Hook 임포트
import styled, { keyframes } from "styled-components";
import { fetchArchivesAll, fetchArchivesByFolder, fetchSearchArchives } from "../../api/archive";
import { useFolderStore } from "../../hooks/useFolderStore";
import { useSearchStore } from "../../hooks/useSearchStore";
import type { ArchiveResponse } from "../../types/archive";
import ArchiveCard from "../Archive/ArchiveCard";

const Content = ({ onEditClick, onAddClick }: { onEditClick: (item: ArchiveResponse) => void, onAddClick: () => void }) => {
  const { activeFolder } = useFolderStore();
  const { searchQuery } = useSearchStore();
  // 2. 감시자(ref)와 감지 상태(inView) 가져오기
  const { ref, inView } = useInView({
    threshold: 0, // 요소가 조금이라도 보이면 true
    // rootMargin: '400px', // 바닥에 닿기 400px 전부터 미리 감지해서 다음 페이지 호출
  });


  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    // 쿼리키에 폴더 ID와 검색어를 포함하여 변경 시마다 초기화
    queryKey: ['archives', activeFolder.id, searchQuery],
    queryFn: ({ pageParam = 0 }) => {
      // 1. 검색어가 있으면 검색 API 호출
      if (searchQuery) {
        return fetchSearchArchives(searchQuery, pageParam);
      }
      // 2. 검색어가 없으면 폴더별 혹은 전체 조회 API 호출
      return activeFolder.id === -1
        ? fetchArchivesAll(pageParam)
        : fetchArchivesByFolder(activeFolder.id, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // via-dto 규격: 현재 페이지 번호 + 1이 전체 페이지보다 작으면 다음 페이지 번호 반환
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    enabled: activeFolder.id !== null,
  });

  // 3. 사용자가 바닥에 도달했는지(inView) 감시하여 다음 페이지 호출
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 중첩된 페이지 구조를 하나의 배열로 통합
  const allArchives = data?.pages.flatMap((page) => page.content) || [];
  const totalElements = data?.pages[0]?.page.totalElements ?? 0;
  
  return (
    <MainContent>
      <ContentHeader>
        <ContentTitle>
          {searchQuery ? (
            <>
              🔍 '{searchQuery}' 검색 결과
              <TotalCount>{totalElements}건</TotalCount>
            </>
          ) : (
            <>
              {activeFolder.name}
              <TotalCount>{totalElements}</TotalCount>
            </>
          )}
        </ContentTitle>
        {/* <ViewOptions>
                <ViewBtn active>그리드</ViewBtn>
                <ViewBtn>리스트</ViewBtn>
                </ViewOptions> */}
      </ContentHeader>

      <CardsGrid>
        {/* 1. 로딩 중일 때 (선택사항) */}
        {isLoading && <LoadingWrapper><LoadingText>데이터를 불러오는 중입니다...</LoadingText></LoadingWrapper>}


        {/* 2. 데이터가 없을 때 (Empty State) */}
        {!isLoading && allArchives.length === 0 && (
          <EmptyWrapper>
            <EmptyIcon>{searchQuery ? '🔎' : '📁'}</EmptyIcon>
            <EmptyTitle>
              {searchQuery ? '검색 결과가 없습니다' : '아카이브가 비어 있습니다'}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery
                ? '다른 키워드로 검색해보시겠어요?'
                : activeFolder.id === -1
                  ? "첫 아카이브를 등록해보세요!"
                  : `'${activeFolder.name}' 폴더가 비어있습니다.`}
            </EmptyDescription>
            {!searchQuery && (
              <AddButton onClick={onAddClick}>+ 아카이브 추가하기</AddButton>
            )}
          </EmptyWrapper>
        )}

        {/* 3. 아카이브 카드 렌더링 */}
        {!isLoading && allArchives.map((item) => (
          <ArchiveCard
            key={item.id}
            item={item}
            onEdit={() => onEditClick(item)}
          />
        ))}

        {/* 4. 추가 데이터 로드 버튼 (무한 스크롤 대신 우선 버튼으로 구현) */}
        {/* {hasNextPage && (
                        <button 
                            onClick={() => fetchNextPage()} 
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? '불러오는 중...' : '더보기'}
                        </button>
                )} */}
      </CardsGrid>


      {/* 수정한 부분: isLoading이 아닐 때만 감시용 요소를 렌더링합니다 */}
      {!isLoading && hasNextPage && (
        <div ref={ref} style={{ height: '50px', margin: '20px 0' }}>
          {isFetchingNextPage && <LoadingText>추가 데이터를 불러오는 중...</LoadingText>}
        </div>
      )}

      {/* {!isLoading && allArchives.length === 0 && <EmptyState />} */}

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
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
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


export default Content;