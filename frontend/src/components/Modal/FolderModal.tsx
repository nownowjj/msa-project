import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useFolderModalStore } from '../../hooks/useFolderModalStore';
import type { FolderNavigationResponse } from '../../types/folder';
import FolderSelect from '../Folder/FolderSelect';


const EMOJI_OPTIONS = ['📁', '📂', '💻', '🎨', '📊', '🎬', '📚', '💡', '🔧', '⚡', '🌟', '🎯', '📝', '🎮', '🏆'];

export const FolderModal = ({ folders }: { folders: FolderNavigationResponse[] }) => {
    const { isOpen, mode, folderData, closeModal } = useFolderModalStore();
    const [folderName, setFolderName] = useState('');

    // ✅ 최상위 폴더는 null이므로 number | null 타입 지정
    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFolderName(folderData?.name || '');
            // ✅ 기존 parentId가 null이면 Root(0 또는 null)로 인식하게 설정
            setSelectedParentId(folderData?.parentId ?? null);
        }
    }, [isOpen, folderData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 서버 전송용 데이터
        const requestData = {
            name: folderName.trim(),
            parentId: selectedParentId === 0 ? null : selectedParentId, // 0을 선택해도 null로 전송
        };

        if (mode === 'create') {
            console.log("생성 요청:", requestData);
            // createFolderMutation.mutate(requestData);
        } else {
            console.log("수정 요청:", folderData?.id, requestData);
            // updateFolderMutation.mutate({ id: folderData.id, ...requestData });
        }
        closeModal();
    };

    return (
        <ModalBackdrop onClick={closeModal}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>{mode === 'create' ? '새 폴더 만들기' : '폴더 수정'}</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <FormSection>
                            <Label>폴더 이름</Label>
                            <FolderNameInput
                                autoFocus
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="이름을 입력하세요"
                            />
                        </FormSection>

                        <FormSection>
                            <Label>상위 폴더</Label>
                            {/* ✅ 공용 FolderSelect 사용 */}
                            <FolderSelect
                                folders={folders}
                                // FolderSelect가 내부적으로 0을 Root로 쓴다면 처리
                                currentFolderId={selectedParentId ?? 0}
                                onChange={(newId) => setSelectedParentId(newId === 0 ? null : newId)}
                                showRootOption={true}
                                excludeId={mode === 'edit' ? folderData?.id : undefined}
                            />
                            <HelperText>
                                {selectedParentId === null
                                    ? "최상위 폴더로 생성됩니다."
                                    : "선택한 폴더의 하위 폴더로 이동합니다."}
                            </HelperText>
                        </FormSection>

                        <ButtonGroup>
                            <CancelButton type="button" onClick={closeModal}>취소</CancelButton>
                            <CreateButton type="submit" disabled={!folderName.trim()}>
                                {mode === 'create' ? '생성' : '수정'}
                            </CreateButton>
                        </ButtonGroup>
                    </form>
                </ModalContent>
            </ModalContainer>
        </ModalBackdrop>
    );
};

// Styled Components
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  width: 480px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #E2E8F0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: #F1F5F9;
  color: #64748B;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #E2E8F0;
    color: #0F172A;
  }
`;

const ModalContent = styled.div`
  padding: 28px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 28px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 10px;
`;

const FolderInputRow = styled.div`
  display: flex;
  gap: 12px;
`;

const EmojiButton = styled.button`
  width: 56px;
  height: 56px;
  border: 2px solid #E2E8F0;
  background: #F8FAFC;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    border-color: #2563EB;
    background: rgba(37, 99, 235, 0.05);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmojiDisplay = styled.span`
  font-size: 28px;
`;

const FolderNameInput = styled.input`
  flex: 1;
  height: 56px;
  padding: 0 16px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-size: 15px;
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0F172A;
  background: #F8FAFC;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563EB;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const EmojiPicker = styled.div`
  margin-top: 12px;
  padding: 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmojiOption = styled.button<{ isSelected: boolean }>`
  width: 44px;
  height: 44px;
  border: 2px solid ${props => props.isSelected ? '#2563EB' : 'transparent'};
  background: ${props => props.isSelected ? 'rgba(37, 99, 235, 0.1)' : '#FFFFFF'};
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: ${props => props.isSelected ? 'rgba(37, 99, 235, 0.15)' : '#F1F5F9'};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-size: 15px;
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0F172A;
  background: #F8FAFC;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563EB;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  option {
    padding: 8px;
  }
`;

const HelperText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #94A3B8;
`;

const PreviewBox = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border: 2px dashed #E2E8F0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
`;

const PreviewIcon = styled.div`
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const PreviewText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 48px;
  border: 2px solid #E2E8F0;
  background: #FFFFFF;
  color: #64748B;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #CBD5E1;
    background: #F8FAFC;
    color: #0F172A;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CreateButton = styled.button`
  flex: 2;
  height: 48px;
  border: none;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  color: #FFFFFF;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #94A3B8;
    box-shadow: none;
  }
`;