import { create } from 'zustand';

interface ConfirmOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  // Promise의 resolve 함수를 보관
  resolve: (value: boolean) => void;
  // 컴포넌트에서 호출할 함수 (Promise를 반환)
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  close: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: { message: '' },
  resolve: () => {},

  confirm: (options) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        options,
        resolve, // 사용자가 버튼을 누를 때까지 이 resolve를 보관합니다.
      });
    });
  },

  close: (value: boolean) => {
    get().resolve(value); // 보관했던 resolve 실행
    set({ isOpen: false });
  },
}));