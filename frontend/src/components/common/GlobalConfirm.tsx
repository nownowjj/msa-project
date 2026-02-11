import { useConfirmStore } from '../../hooks/useConfirmStore';
import * as S from '../../types/ConfirmModal.styles';


export const GlobalConfirm = () => {
  const { isOpen, options, close } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <S.Backdrop onClick={() => close(false)}>
      <S.Dialog onClick={(e) => e.stopPropagation()}>
        <S.Message>{options.message}</S.Message>
        <S.ButtonGroup>
          <S.CancelButton onClick={() => close(false)}>
            {options.cancelText || '취소'}
          </S.CancelButton>
          <S.ConfirmButton onClick={() => close(true)}>
            {options.confirmText || '확인'}
          </S.ConfirmButton>
        </S.ButtonGroup>
      </S.Dialog>
    </S.Backdrop>
  );
};