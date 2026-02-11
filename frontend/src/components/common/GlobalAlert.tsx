import { useAlertStore } from '../../hooks/useAlertStore';
import * as S from '../../types/ConfirmModal.styles';

export const GlobalAlert = () => {
  const { isOpen, message, closeAlert } = useAlertStore();

  if (!isOpen) return null;

  return (
    <S.Backdrop onClick={closeAlert}>
      <S.Dialog onClick={(e) => e.stopPropagation()}>
        <S.Message>{message}</S.Message>
        <S.ButtonGroup>
          <S.ConfirmButton onClick={closeAlert} style={{ background: '#4dabf7' }}>
            확인
          </S.ConfirmButton>
        </S.ButtonGroup>
      </S.Dialog>
    </S.Backdrop>
  );
};