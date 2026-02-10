import { useQuery } from "@tanstack/react-query";
import styled, { keyframes } from "styled-components";
import { fetchArchivesAll, fetchArchivesByFolder } from "../../api/archive";
import type { SelectedFolder } from "../../pages/DashBoard";
import ArchiveCard from "../Archive/ArchiveCard";
import type { ArchiveResponse } from "../../types/archive";


const Content = ( { activeFolder ,onEditClick }: { activeFolder: SelectedFolder ,onEditClick: (item: ArchiveResponse) => void }) => {
    
    const {data: archives ,isLoading} =useQuery({
      // key에 ID를 넣어야 ID가 바뀔 때마다 캐시를 관리하고 새로 요청함
      queryKey: ['archives', activeFolder.id],
      queryFn: () => activeFolder.id === -1 ? 
                        fetchArchivesAll():
                        fetchArchivesByFolder(activeFolder.id),
      enabled: activeFolder.id !== null, // ID가 있을 때만 쿼리 수행
    })

    return (
        <MainContent>
            <ContentHeader>
                <ContentTitle>{activeFolder.name}</ContentTitle>
                <ViewOptions>
                <ViewBtn active>그리드</ViewBtn>
                <ViewBtn>리스트</ViewBtn>
                </ViewOptions>
            </ContentHeader>

            <CardsGrid>
                {/* 1. 로딩 중일 때 (선택사항) */}
                {isLoading && <LoadingWrapper><LoadingText>데이터를 불러오는 중입니다...</LoadingText></LoadingWrapper>}


                {/* 2. 데이터가 없을 때 (Empty State) */}
                {!isLoading && archives?.length === 0 && (
                  <EmptyWrapper>
                    <EmptyIcon>📁</EmptyIcon>
                    <EmptyTitle>아카이브가 비어 있습니다</EmptyTitle>
                    <EmptyDescription>
                      {activeFolder.id === -1 
                        ? "아직 저장된 링크가 없네요. 첫 아카이브를 등록해보세요!" 
                        : `'${activeFolder.name}' 폴더에 저장된 링크가 없습니다.`}
                    </EmptyDescription>

                    <AddButton onClick={() => console.log('등록 모달 열기')}>
                      + 아카이브 추가하기
                    </AddButton>
                  </EmptyWrapper>
                )}

                {!isLoading && archives?.map((item) => (
                  <ArchiveCard
                    key={item.id} 
                    item={item} 
                    onDelete={(id) => {
                      if(confirm('정말 삭제하시겠습니까?')) {
                        // 삭제 로직 호출
                      }
                    }}
                    onEdit={() => onEditClick(item)} // 카드에서 수정 클릭 시 핸들러 호출
                    // onEdit, onMove 등도 필요하면 여기서 핸들링
                  />
                ))}
            </CardsGrid>
        </MainContent>
    );
};

const MainContent = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background-color: #f9fafb;
`;

const ContentHeader = styled.div`
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
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