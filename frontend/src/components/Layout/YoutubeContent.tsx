import { useQuery } from "@tanstack/react-query";
import styled, { keyframes } from "styled-components";
import { fetchMyPlaylists } from "../../api/youtube";
import { useYoutubeStore } from "../../store/useYoutubeStore";
import YoutubeCard from "../Archive/YoutubeCard";

const YoutubeContent = ({ onEditClick }: { onEditClick: (item: any) => void }) => {

  const { viewMode, playlistItems, isLoading: isStoreLoading, selectPlaylist , selectedPlaylistId ,resetToAll ,openVideoModal } = useYoutubeStore();

  // 2. 전체 재생목록 React Query (기존 로직 유지)
  const { data: playlists, isLoading: isQueryLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: fetchMyPlaylists,
    staleTime: 1000 * 60 * 5
  });
  
  // 로딩 상태 통합
  // const showLoading = isQueryLoading || (viewMode === 'PLAYLIST_DETAIL' && isStoreLoading);
  const showLoading = isQueryLoading || isStoreLoading;

  // 현재 제목 결정 로직
  const currentTitle = viewMode === 'PLAYLIST_DETAIL' 
    ? playlists?.find(p => p.id === selectedPlaylistId)?.snippet?.title || "상세 보기"
    : "전체 재생목록";

  // 아이템 개수 결정 로직
  const displayCount = showLoading ? "..." : (viewMode === 'ALL_PLAYLISTS' ? playlists?.length : playlistItems?.length);

  return (
    <MainContent>
      <ContentHeader>
        <ContentTitle>
          {viewMode === 'PLAYLIST_DETAIL' && (
            <BackButton onClick={resetToAll} title="목록으로 돌아가기">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </BackButton>
          )}
          {/* {currentTitle} */}
          <TitleText>
            {currentTitle}
            <TotalCount>{displayCount ?? 0}</TotalCount>
          </TitleText>
          
        </ContentTitle>
        
      </ContentHeader>

      <CardsGrid>
        {/* 1. 로딩 상태 */}
        {showLoading ? (
          <LoadingWrapper>
            <Spinner />
            <LoadingText>데이터를 불러오는 중입니다...</LoadingText>
          </LoadingWrapper>
        ) : (
          <>
            {/* 2. 전체 재생목록 모드 */}
            {viewMode === 'ALL_PLAYLISTS' && (
              <>
                {playlists?.length === 0 ? (
                  <EmptyState message="재생목록이 비어 있습니다." />
                ) : (
                  playlists?.map((item) => (
                    <YoutubeCard 
                      key={item.id} 
                      item={item} 
                      onClick={() => selectPlaylist(item.id)} // 2. 클릭 시 상세 요청 트리거
                    />
                  ))
                )}
              </>
            )}

            {/* 3. 재생목록 상세 모드 (아이템 목록) */}
            {viewMode === 'PLAYLIST_DETAIL' && (
              <>
                {playlistItems.length === 0 ? (
                  <EmptyState message="이 재생목록에 영상이 없습니다." />
                ) : (
                  playlistItems.map((item) => {
                    // DTO에서 videoId 추출 (PlaylistItemContentDetails 혹은 resourceId 기반)
                    const videoId = item.contentDetails?.videoId || (item as any).snippet?.resourceId?.videoId;
                    
                    return (
                      <YoutubeCard 
                        key={item.id} 
                        item={item} 
                        onEdit={() => onEditClick(item)} // 카드에서 수정 버튼 클릭 시 실행
                        onClick={() => {
                            console.log(videoId)
                            videoId && openVideoModal(videoId)
                          }
                        } 
                      />
                    );
                  })
                )}
              </>
            )}
          </>
        )}
      </CardsGrid>

    </MainContent>
  );
};
const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  &:hover { color: #111827; }
`;


// 공통 Empty State 컴포넌트 화 (내부용)
const EmptyState = ({ message }: { message: string }) => (
  <EmptyWrapper>
    <EmptyIcon>📁</EmptyIcon>
    <EmptyTitle>{message}</EmptyTitle>
    <EmptyDescription>유튜브에서 재생목록을 관리해보세요.</EmptyDescription>
  </EmptyWrapper>
);

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
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const TitleText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  @media (max-width: 768px) { font-size: 18px; }
`;

const TotalCount = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #111827; // 약간 흐리게 처리해서 제목과 구분
  
  &::before {
    content: "(";
  }
  &::after {
    content: ")";
  }

  @media (max-width: 768px) {
    font-size: 18px;
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


export default YoutubeContent;