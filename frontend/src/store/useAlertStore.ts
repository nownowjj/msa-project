import { create } from 'zustand';

interface AlertState {
  isOpen: boolean;
  message: string;
  resolve: () => void;
  // alert 호출 시 Promise를 반환하여 '확인'을 누를 때까지 기다릴 수 있게 함
  showAlert: (message: string) => Promise<void>;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  isOpen: false,
  message: '',
  resolve: () => {},

  showAlert: (message) => {
    return new Promise((resolve) => {
      set({ isOpen: true, message, resolve });
    });
  },

  closeAlert: () => {
    get().resolve();
    set({ isOpen: false });
  },
}));