import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FolderCreateRequest, FolderUpdateRequest } from '../types/folder';
import { createFolder, deleteFolder, updateFolder } from '../api/folder';
import { useAlertStore } from './useAlertStore';


export const useFolderMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  // ✅ 공통 성공 처리 로직
  const handleSuccess = async (message: string) => {
    // 1. 폴더 목록 쿼리 무효화 (await를 사용하여 데이터 갱신 보장)
    await queryClient.invalidateQueries({ queryKey: ['folders'] });

    await showAlert(message);

    if (onSuccessCallback) onSuccessCallback();
  };

  // 1. 생성 Mutation
  const createMutation = useMutation({
    mutationFn: (request: FolderCreateRequest) => createFolder(request),
    onSuccess: () => handleSuccess('폴더가 생성되었습니다.'),
    onError: async (error: any) => {
      const msg = error.response?.data?.message || '폴더 생성에 실패했습니다.';
      await showAlert(msg);
    }
  });

  // 2. 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: FolderUpdateRequest }) => 
      updateFolder(id, request),
    onSuccess: () => handleSuccess('폴더가 수정되었습니다.'),
    onError: async (error: any) => {
      const msg = error.response?.data?.message || '수정에 실패했습니다.';
      await showAlert(msg);
    }
  });

  // 3. 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFolder(id),
    onSuccess: () => handleSuccess('폴더가 삭제되었습니다.'),
    onError: async (error: any) => {
      const msg = error.response?.data?.message || '삭제에 실패했습니다.';
      await showAlert(msg);
    }
  });

  return {
    createFolder: createMutation.mutate,
    updateFolder: updateMutation.mutate,
    deleteFolder: deleteMutation.mutate,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};