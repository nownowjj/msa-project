import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { fetchArchiveAiAnalyze, fetchArchiveMetadata } from "../../api/archive";
import { fetchAllFolder, findDefaultFolder } from "../../api/folder";
import { useArchiveMutation } from "../../hooks/useArchiveMutation";
import type { ArchiveResponse } from "../../types/archive";
import FolderSelect from "../Folder/FolderSelect";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: ArchiveResponse | null; // 수정 시 데이터
  initialFolderId?: number | null; // ✅ 추가: 새로 만들 때의 초기 폴더 ID
}

const SidePanel = ({ isOpen, onClose, data, initialFolderId }: SidePanelProps) => {
    const {createArchive, updateArchive, deleteArchive, isSaving ,isDeleting } = useArchiveMutation(onClose);

    // 1. 자동 입력을 위한 상태 관리
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<number>(0);

    const [summary, setSummary] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);

    // 폴더 목록 가져오기 (Sidebar와 동일한 캐시 데이터 공유)
    const { data: folders } = useQuery({
        queryKey: ['folders'],
        queryFn: fetchAllFolder,
    });



  // 1. AI 분석을 위한 Mutation
    const aiAnalyzeMutation = useMutation({
      mutationFn: fetchArchiveAiAnalyze,
      onSuccess: (res) => {
        if(res.summary) setSummary(res.summary);
        if(res.keywords) setKeywords(res.keywords);
      },
      onError: () => {
        alert("AI 분석에 실패했습니다. 다시 시도해주세요.");
      }
    });

    // ✅ 마지막으로 메타데이터를 요청했던 URL을 저장
    const lastFetchedUrl = useRef('');

    // 2. 메타데이터 호출을 위한 Mutation
    const metadataMutation = useMutation({
      mutationFn: fetchArchiveMetadata,
      onSuccess: (meta) => {
        if (meta.title) setTitle(meta.title);
        if (meta.thumbnailUrl) setThumbnail(meta.thumbnailUrl);
      },
      onError: () => {
        console.error("메타데이터를 가져오는 데 실패했습니다.");
        setTitle('')
        setThumbnail('');
      }
    });


    // 4. URL 유효성 검사 및 호출 핸들러
    const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const inputUrl = e.target.value.trim();

      if (!inputUrl) return; // 빈 값일 때 방지
      if (data) return; // 수정 모드일 때는 동작 방지

      // ✅ 이전 호출과 URL이 같으면 API 호출 차단
      if (inputUrl === lastFetchedUrl.current) {
        console.log("동일한 URL이므로 API 요청을 스킵합니다.");
        return;
      }

      // 간단한 URL 유효성 검사
      const urlPattern = /^(https?:\/\/)/;
      if (urlPattern.test(inputUrl)) {
        lastFetchedUrl.current = inputUrl; // 호출 전 현재 URL 기록
        metadataMutation.mutate(inputUrl);
      }
    };

    // 3. 데이터 초기화 (신규/수정 전환 시)
    useEffect(() => {
      if (!isOpen) return;

      if (data) {
        // [수정 모드]
        setUrl(data.url || '');
        setTitle(data.title || '');
        setThumbnail(data.thumbnailUrl || '');
        setSelectedFolderId(data.folderId); // 기존 저장된 폴더 ID
        setSummary(data.aiSummary || '');
        setKeywords(data.keywords || []);
        lastFetchedUrl.current = data.url || '';
      } else {
        // [신규 생성 모드]
        setUrl('');
        lastFetchedUrl.current = '';
        setTitle('');
        setThumbnail('');
        setSummary('');
        setKeywords([]);
        
        // ✅ 폴더 초기화 로직 보강
        if (initialFolderId !== undefined && initialFolderId !== null && initialFolderId !== -1) {
          // 1순위: 현재 보고 있는 폴더가 있을 경우 그 폴더로 지정
          setSelectedFolderId(initialFolderId);
        } else if (folders) {
          // 2순위: 보고 있는 폴더가 없으면(전체보기 등) 기존 기본 폴더 로직 적용
          const defaultFolder = findDefaultFolder(folders);
          if (defaultFolder) {
            setSelectedFolderId(defaultFolder.id);
          }
        }
      }
    }, [data, isOpen, folders ,initialFolderId]); // folders를 추가하여 데이터 로드 즉시 반영


    // 2. AI 생성 버튼 핸들러
    const handleAiAnalyze = () => {
      if (!url) {
        alert("분석할 URL이 없습니다.");
        return;
      }
      aiAnalyzeMutation.mutate(url);
    };


    // 키워드 삭제 핸들러
    const removeTag = (indexToRemove: number) => {
      setKeywords(keywords.filter((_, index) => index !== indexToRemove));
    };

    // 2. 저장/수정 버튼 클릭 핸들러
    const handleSave = () => {
      // 유효성 검사
      if (!url || !title) {
        alert('URL과 제목은 필수 항목입니다.');
        return;
      }

      // 공통 요청 데이터 구성
      const requestData = {
        title,
        aiSummary: summary || null,
        folderId: Number(selectedFolderId),
        keywords: keywords.length > 0 ? keywords : null,
      };

      if (data) {
        // ✅ 수정 모드: PATCH 요청
        updateArchive({id: data.id, request: requestData });
      } else {
        // ✅ 생성 모드: POST 요청 (기존 로직)
        createArchive({
          ...requestData,
          url,
          thumbnailUrl: thumbnail || null,
        });
      }

    };

    const handleDeleteInPanel = async (id:number) => {
      await deleteArchive(id);
      onClose(); // 삭제 성공 시 패널 닫기 (커스텀 훅 내부 onSuccess에 넣거나 여기서 처리)
    };


    return (
    <SidePanelContainer isOpen={isOpen}>
      <PanelHeader>
        <PanelTitle>아카이브 {data ? '수정' : '생성'}</PanelTitle>
        <PanelCloseBtn onClick={onClose}>✕</PanelCloseBtn>
      </PanelHeader>

      <PanelContent key={data?.id || 'new'}>
        {/* 5. 썸네일 표시: 상태(thumbnail) 기반 */}
        <PanelThumbnail
          style={{ 
            background: thumbnail 
                ? `url(${thumbnail}) no-repeat center / cover` 
                : '#f1f3f5' 
          }}
        >
          <ThumbnailBadge>ARTICLE</ThumbnailBadge>
        </PanelThumbnail>

        <FormGroup>
          <FormLabel>URL</FormLabel>
          <FormInput 
            type="text" 
            placeholder="https://..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur} // 포커스 나갈 때 자동 호출
            readOnly={!!data}
            className={data ? 'readonly' : ''}
          />
          {data && <HelperText>원본 링크는 수정할 수 없습니다</HelperText>}

          {/* 2. 메타데이터 요청 실패 시 안내 (신규 모드일 때만) */}
          {!data && metadataMutation.isError && (
            <HelperText style={{ color: 'var(--error, #fa5252)' }}>
              ⚠️ 유효하지 않은 URL이거나 정보를 가져올 수 없는 사이트입니다.
            </HelperText>
          )}
          
          {/* 3. (옵션) 로딩 중일 때 안내 */}
          {!data && metadataMutation.isPending && (
            <HelperText>사이트 정보를 분석하고 있습니다...</HelperText>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>제목</FormLabel>
          <FormInput 
            placeholder={metadataMutation.isPending ? "정보를 가져오는 중..." : "제목을 입력하세요"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={metadataMutation.isPending} // 로딩 중에는 입력 방지 (선택 사항)
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>키워드</FormLabel>
          <TagsInputContainer style={{ opacity: aiAnalyzeMutation.isPending ? 0.7 : 1 }}>
            {/* AI 분석 중일 때 메시지 표시 */}
            {aiAnalyzeMutation.isPending && (
              <div style={{ width: '100%', marginBottom: '8px', color: '#4dabf7', fontSize: '12px', fontWeight: 'bold' }}>
                ⏳ AI가 키워드를 추출하는 중입니다...
              </div>
            )}

            {keywords.map((tag, index) => (
              <TagItem key={`${tag}-${index}`}>
                #{tag} 
                {/* 분석 중에는 삭제도 방지하고 싶다면 disabled 처리 가능 */}
                <TagRemoveBtn 
                  onClick={() => !aiAnalyzeMutation.isPending && removeTag(index)}
                  style={{ cursor: aiAnalyzeMutation.isPending ? 'not-allowed' : 'pointer' }}
                >
                  ×
                </TagRemoveBtn>
              </TagItem>
            ))}

          <TagInput 
              placeholder={aiAnalyzeMutation.isPending ? "분석 중에는 입력할 수 없습니다" : "키워드 직접 입력 (Enter)"}
              disabled={aiAnalyzeMutation.isPending} // ✅ 로딩 중 입력 방지
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setKeywords([...keywords, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
              style={{
                cursor: aiAnalyzeMutation.isPending ? 'not-allowed' : 'text',
                backgroundColor: aiAnalyzeMutation.isPending ? '#f1f3f5' : 'transparent'
              }}
          />
          </TagsInputContainer>
        </FormGroup>

        <FormGroup>
          <FormLabel>요약</FormLabel>
          <FormTextarea 
            placeholder={aiAnalyzeMutation.isPending ? "AI가 내용을 분석하여 요약 중입니다..." : "AI 요약 정보가 표시됩니다"}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            disabled={aiAnalyzeMutation.isPending}
          />
          {/* 3. AI 버튼 상태 제어 */}
          <AiButton 
            onClick={handleAiAnalyze}
            disabled={aiAnalyzeMutation.isPending || !url}
            style={{ 
              marginTop: '8px',
              opacity: aiAnalyzeMutation.isPending ? 0.7 : 1,
              cursor: aiAnalyzeMutation.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {aiAnalyzeMutation.isPending ? (
              <>⏳ 분석 중...</>
            ) : (
              <>🔄 요약&키워드 AI {data ? '재생성' : '생성'}</>
            )}
          </AiButton>
        </FormGroup>

        <FormGroup>
            <FormLabel>폴더</FormLabel>
            {folders && (
                <FolderSelect
                    folders={folders} 
                    currentFolderId={selectedFolderId} 
                    onChange={(newId) => setSelectedFolderId(Number(newId))}
            />
          )}
          <HelperText>아카이브를 보관할 폴더를 선택하세요</HelperText>

        </FormGroup>

      </PanelContent>

      <PanelFooter>
        <BtnSave onClick={handleSave} disabled={isSaving}>
          {isSaving ? '저장 중...' : (data ? '변경사항 저장' : '저장')}
        </BtnSave>
        {data && (
        <BtnDelete 
          onClick={()=> handleDeleteInPanel(data.id)} disabled={isDeleting}>
                  🗑️
        </BtnDelete>
        )}
      </PanelFooter>
    </SidePanelContainer>
  );
};

export default SidePanel;


// 전역 변수가 정의되어 있지 않을 경우를 대비한 Fallback 컬러들입니다.
const colors = {
  primary: '#4dabf7',
  primaryHover: '#339af0',
  primaryLight: '#e7f5ff',
  border: '#e9ecef',
  borderLight: '#f1f3f5',
  textPrimary: '#212529',
  textSecondary: '#495057',
  textMuted: '#adb5bd',
  bgCard: '#ffffff',
  bgMain: '#f8f9fa',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const SidePanelContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  height: 100vh;
  background: ${colors.bgCard};
  border-left: 1px solid ${colors.border};
  box-shadow: ${colors.shadowXl};
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 101;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

export const PanelTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const PanelCloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: ${colors.borderLight};
  color: ${colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &:hover {
    background: ${colors.border};
    color: ${colors.textPrimary};
  }
`;

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px;

  padding-bottom:130px;

  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.textMuted};
  }
`;

export const PanelThumbnail = styled.div<{ bgGradient?: string }>`
  width: 100%;
  height: 240px;
  background: ${({ bgGradient }) => bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 28px;
  position: relative;
  border: 1px solid ${colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ThumbnailBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 8px;
`;

const commonInputStyle = css`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  color: ${colors.textPrimary};
  background: ${colors.bgMain};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: white;
    box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.2);
  }
`;

export const FormInput = styled.input`
  ${commonInputStyle}
  &.readonly {
    background: ${colors.borderLight};
    color: ${colors.textMuted};
    cursor: not-allowed;
  }
`;

export const FormTextarea = styled.textarea`
  ${commonInputStyle}
  resize: vertical;
  min-height: 100px;
`;

export const FormSelect = styled.select`
  ${commonInputStyle}
  cursor: pointer;
  transition: all 0.2s;
  appearance: none; /* 기본 화살표 스타일 제거 (커스텀 가능) */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 3px var(--primary-light);
  }
`;

export const TagsInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.bgMain};
  min-height: 48px;
  align-items: center;

  &:focus-within {
    border-color: ${colors.primary};
    background: white;
    box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.2);
  }
`;

const AiButton = styled.button`
    width: 100%;
    padding: 12px 20px;
    border: 1px solid var(--border);
    background: white;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;

    &:hover{
        border-color: var(--primary);
        color: var(--primary);
        background: ${colors.primaryLight}
    }
`

export const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${colors.primaryLight};
  color: ${colors.primary};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
`;

export const TagRemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  cursor: pointer;
  font-size: 16px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${colors.primary};
    color: white;
  }
`;

export const TagInput = styled.input`
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;

  &:disabled {
    background-color: #f1f3f5;
    cursor: not-allowed;
    &::placeholder {
      color: #adb5bd;
    }
  }
`;

export const PanelFooter = styled.div`
  padding: 20px 28px;
  border-top: 1px solid ${colors.border};
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  background: ${colors.bgMain};
`;

export const BtnSave = styled.button`
  flex: 1;
  height: 48px;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const BtnDelete = styled.button`
  height: 48px;
  padding: 0 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const HelperText = styled.div`
  font-size: 13px;
  color: ${colors.textMuted};
  margin-top: 6px;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${colors.borderLight};
  margin: 24px 0;
`;