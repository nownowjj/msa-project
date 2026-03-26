import dayjs from 'dayjs';
import styled from 'styled-components';
import type { ArchiveResponse } from '../../types/archive';
import { useArchiveMutation } from '../../hooks/useArchiveMutation';
import { useConfirmStore } from '../../store/useConfirmStore';
import { useAuthStore } from '../../store/useAuthStore';


interface ArchiveCardProps {
  item: ArchiveResponse;
  onEdit?: (id: number) => void;
  onMove?: (id: number) => void;
}

const ArchiveCard = ({ item, onEdit, onMove }: ArchiveCardProps) => {
  // const currentId = useAuthStore((state) => state.user?.id);

  // 도메인 추출 로직 안전하게 처리
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'link';
    }
  };

  const { deleteArchive, isDeleting } = useArchiveMutation();
  const confirm = useConfirmStore((state) => state.confirm);

  // 아카이브 삭제
  const handleDelete = async (e: React.MouseEvent ,item: ArchiveResponse) => {
    e.stopPropagation();
    const isConfirmed = await confirm({
      message: `해당 아카이브를 정말 삭제할까요?`,
      confirmText: "삭제",
      cancelText: "취소"
    });

    if (isConfirmed) {
      deleteArchive(item.id);
    } 
  };

  return (
    <Card>
      <CardThumbnail 
        onClick={() => window.open(item.url, '_blank')}
        style={{ 
          background: item.thumbnailUrl 
            ? `url(${item.thumbnailUrl}) no-repeat center / cover` 
            : '#f1f3f5' 
        }}
      >
        <CardType>{getHostname(item.url)}</CardType>
      </CardThumbnail>

      <CardContent>

        <CardContentArea onClick={() => onEdit?.(item.id)}>
          <CardTitle>
            {item.title || '제목 없음'}
          </CardTitle>
          
          <CardSummary>
            {item.aiSummary || '요약 정보가 없습니다.'}
          </CardSummary>

          <CardTags>
            {item.keywords.map(tag => (
              <Tag key={tag}>#{tag}</Tag>
            ))}
          </CardTags>
        </CardContentArea>

        <CardFooter>
          <CardDate>📅 {dayjs(item.createdAt).format('YYYY.MM.DD')}</CardDate>
          
          <CardActions>
            <ActionBtn title="수정" onClick={() => onEdit?.(item.id)}>✏️</ActionBtn>
            {/* <ActionBtn title="이동" onClick={() => onMove?.(item.id)}>📁</ActionBtn> */}
            <ActionBtn 
              title="삭제" 
              onClick={(e) => handleDelete(e, item)}
              disabled={isDeleting}
            >
              {isDeleting ? '...' : '🗑️'}
            </ActionBtn>
          </CardActions>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default ArchiveCard;

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
  cursor: pointer;
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

const CardThumbnail = styled.div<{ index?: number }>`
  width: 100%;
  height: 200px;
  background: ${props => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ];
    return gradients[(props.index || 0) % gradients.length];
  }};
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
