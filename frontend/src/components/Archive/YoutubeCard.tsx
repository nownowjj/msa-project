import dayjs from 'dayjs';
import { useState } from 'react';
import styled from 'styled-components';
import { isPlaylistItem, type YoutubePlaylistDto, type YoutubePlaylistItemDto } from '../../types/youtube';


interface YoutubeCardProps {
  item: YoutubePlaylistDto|YoutubePlaylistItemDto;
  onClick?: () => void; // 클릭 이벤트 주입받기
  onEdit?: () => void;  // 수정 버튼 클릭 (SidePanel 오픈)
}

const YoutubeCard = ({item , onClick ,onEdit }: YoutubeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false); // 영상 로드 완료 상태

  const isVideo = isPlaylistItem(item);
  const videoId = isVideo ? item.snippet.resourceId.videoId : null;

  // 1. 유튜브 자동재생용 파라미터 구성 (Native 방식)
  // mute=1과 autoplay=1은 브라우저 정책상 필수입니다.
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`;

  // 도메인 추출 로직 안전하게 처리
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Youtube';
    }
  };

  return (
    <Card 
      onMouseEnter={() => {
        setIsHovered(true);
        setIsReady(false); // 새로운 호버 시 상태 초기화
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsReady(false);
      }}
    >
      <CardThumbnail
        onClick={onClick} 
        $isClickable={!!onClick}
      >
        {/* 썸네일 기본 노출 */}
        <ThumbnailImg 
          $isVisible={!isReady}
          src={item.snippet.thumbnails.standard?.url || item.snippet.thumbnails.high?.url} 
          alt={item.snippet.title}
        />
        
        {/* Native IFrame 방식: ReactPlayer 제거 */}
        {isVideo && isHovered && videoId && (
          <VideoPreview $isReady={isReady}>
            <iframe
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => {
                console.log("✅ [Native IFrame] Loaded!");
                setIsReady(true);
              }}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </VideoPreview>
        )}
        <CardType>{getHostname(item.snippet.thumbnails.standard.url )}</CardType>
      </CardThumbnail>

      <CardContent>

        <CardContentArea>
          <CardTitle>
            {item.snippet.title || '제목 없음'}
          </CardTitle>
          
          <CardSummary>
            {item.snippet.description || '요약 정보가 없습니다.'}
          </CardSummary>

          <CardTags>
          </CardTags>
        </CardContentArea>

        <CardFooter>
          <CardDate>📅 {dayjs(item.snippet.publishedAt).format('YYYY.MM.DD')}</CardDate>
          
          {isVideo && onEdit &&
            <CardActions>
              <ActionBtn title="수정" 
                onClick={(e) => {
                  e.stopPropagation(); // 💡 중요: 부모 Card의 onClick(모달) 발동 방지
                  onEdit();
                }}
              >
                ✏️
              </ActionBtn>
            </CardActions>
          }
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default YoutubeCard;

const CardActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
`;


const Card = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #2563eb;

    ${CardActions} {
      opacity: 1;
    }
  }
`;

const CardThumbnail = styled.div<{ $isClickable: boolean }>`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  background-color:black;
  cursor: ${props => (props.$isClickable ? 'pointer' : 'default')};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


const VideoPreview = styled.div<{ $isReady: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => (props.$isReady ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 2;
  pointer-events: none;
  background: black;

  /* 검은 띠 제거 및 꽉 차게 설정 */
  iframe {
    width: 100%;
    height: 100%;
    // transform: scale(1.35); /* 레터박스 제거를 위해 조금 더 크게 */
    object-fit: cover;
  }
`;

const ThumbnailImg = styled.img<{ $isVisible: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 1; // 썸네일은 1
`;

const CardType = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #111827;
`;

const CardContent = styled.div`
  padding: 20px;

  display: flex;         /* Flexbox 활성화 */
  flex-direction: column; /* 세로 방향 정렬 */
  height: calc(100% - 200px); /* 썸네일 제외 영역 꽉 채우기 */
`;

const CardContentArea =styled.div``

const CardTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardSummary = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  flex: 1;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

const Tag = styled.span`
  padding: 4px 10px;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;

  margin-top: auto; /* ✅ 이 줄이 핵심! 남은 공간을 모두 위로 밀어냅니다. */
`;

const CardDate = styled.span`
  font-size: 13px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #2563eb;
    color: white;
  }
`;
