import styled from "styled-components";

const Content = () => {
    const dummyData = [
        { title: "React 19의 새로운 기능들과 Server Components 심층 분석", type: "Article", date: "2일 전", tags: ["#React", "#Frontend"] },
        { title: "CSS Grid와 Flexbox를 활용한 반응형 레이아웃 가이드", type: "Video", date: "3일 전", tags: ["#CSS", "#Layout"] },
        { title: "TypeScript 5.0 신규 기능 및 타입 시스템 개선사항", type: "Article", date: "5일 전", tags: ["#TypeScript", "#JS"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
        { title: "Node.js 성능 최적화 기법: 메모리 관리", type: "Article", date: "1주 전", tags: ["#NodeJS", "#Backend"] },
    ];
    
    return (
        <MainContent>
            <ContentHeader>
                <ContentTitle>전체보기</ContentTitle>
                <ViewOptions>
                <ViewBtn active>그리드</ViewBtn>
                <ViewBtn>리스트</ViewBtn>
                </ViewOptions>
            </ContentHeader>

            <CardsGrid>
                {dummyData.map((item, index) => (
                    <Card key={index}>
                        <CardThumbnail index={index}>
                        <CardType>{item.type}</CardType>
                        </CardThumbnail>
                        <CardContent>
                        <CardTitle>{item.title}</CardTitle>
                        <CardSummary>
                            AI가 요약한 본문 내용이 여기에 들어갑니다. 최대 3줄까지 노출되며 그 이상은 생략됩니다...
                        </CardSummary>
                        <CardTags>
                            {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                        </CardTags>
                        <CardFooter>
                            <CardDate>📅 {item.date}</CardDate>
                            <CardActions>
                            <ActionBtn>✏️</ActionBtn>
                            <ActionBtn>📁</ActionBtn>
                            <ActionBtn>🗑️</ActionBtn>
                            </CardActions>
                        </CardFooter>
                        </CardContent>
                    </Card>
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
`;

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

export default Content;