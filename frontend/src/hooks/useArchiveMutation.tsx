import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArchive, deleteArchive, updateArchive } from '../api/archive';
import type { ArchiveCreateRequest, ArchiveUpdateRequest } from '../types/archive';

export const useArchiveMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  // 공통 성공 처리 로직
  const handleSuccess = async (message: string) => {
    // 1. 무효화 작업을 await로 기다리거나 프로미스를 보장
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['archives'] }),
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    ]);

    // 2. 그 다음 알림 창 띄우기
    alert(message);
    if (onSuccessCallback) onSuccessCallback();
  };

  // 1. 생성 Mutation
  const createMutation = useMutation({
    mutationFn: (request: ArchiveCreateRequest) => createArchive(request),
    onSuccess: () => handleSuccess('아카이브가 저장되었습니다.'),
    onError: (error) => {
      console.error(error);
      alert('저장에 실패했습니다. 필수 항목을 확인해주세요.');
    }
  });

  // 2. 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: ArchiveUpdateRequest }) => 
      updateArchive(id, request),
    onSuccess: () => handleSuccess('변경사항이 저장되었습니다.'),
    onError: () => alert('수정에 실패했습니다.')
  });
  
  // 3. 삭제 Mutation (기존 유지)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteArchive(id),
    onSuccess: () => handleSuccess('삭제되었습니다.'),
    onError: () => alert('삭제 실패했습니다.')
  });


  return {
    createArchive: createMutation.mutate,
    updateArchive: updateMutation.mutate,
    deleteArchive: deleteMutation.mutate,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};