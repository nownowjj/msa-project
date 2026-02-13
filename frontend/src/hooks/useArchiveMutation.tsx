import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArchive, deleteArchive, updateArchive } from '../api/archive';
import type { ArchiveCreateRequest, ArchiveUpdateRequest } from '../types/archive';
import { useAlertStore } from './useAlertStore';

export const useArchiveMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  // 공통 성공 처리 로직
  const handleSuccess = async (message: string) => {
    // 1. 무효화 작업을 await로 기다리거나 프로미스를 보장
    queryClient.invalidateQueries({ queryKey: ['archives'] }),
    queryClient.invalidateQueries({ queryKey: ['folders'] })
    

     await showAlert(message);

    if (onSuccessCallback) onSuccessCallback();
  };

  // 1. 생성 Mutation
  const createMutation = useMutation({
    mutationFn: (request: ArchiveCreateRequest) => createArchive(request),
    onSuccess: () => handleSuccess('아카이브가 저장되었습니다.'),
    onError: async (error: any) => {
      console.error(error);
      const msg = error.response?.data?.message || '저장에 실패했습니다. 필수 항목을 확인해주세요.';
      await showAlert(msg);
    }
  });

  // 2. 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: ArchiveUpdateRequest }) => 
      updateArchive(id, request),
    onSuccess: () => handleSuccess('변경사항이 저장되었습니다.'),
    onError: async (error :any) => {
      const msg = error.response?.data?.message || '수정에 실패했습니다.';
      await showAlert(msg);
    }
  });
  
  // 3. 삭제 Mutation (기존 유지)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteArchive(id),
    onSuccess: () => handleSuccess('삭제되었습니다.'),
    onError: async (error: any) => {
      const msg = error.response?.data?.message || '삭제에 실패했습니다.';
      await showAlert(msg);
    }
  });


  return {
    createArchive: createMutation.mutate,
    updateArchive: updateMutation.mutate,
    deleteArchive: deleteMutation.mutate,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};