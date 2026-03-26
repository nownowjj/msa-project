import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. 유저 정보 타입 정의 (백엔드 LoginResponse 스펙과 매칭)
interface User {
  id: number;
  email?: string;
  name?: string;
  picture: string | null; // 백엔드의 profile 필드
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isNewUser: boolean; // 신규 가입자 여부 관리
  
  // 액션: 로그인 성공 시 호출
  login: (userData: User, isNewUser?: boolean) => void;
  
  // 액션: 로그아웃 시 호출
  logout: () => void;
  
  // 액션: 유저 정보만 부분 업데이트 (예: 프로필 이미지 변경 시)
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isNewUser: false,

      // 로그인 처리
      login: (userData, isNewUser = false) => 
        set({ 
          user: userData, 
          isLoggedIn: true, 
          isNewUser 
        }),

      // 로그아웃 처리 (토큰은 스토어 밖에서 처리하거나 여기서 병행)
      logout: () => {
        localStorage.removeItem('token'); // 토큰 동시 삭제
        set({ user: null, isLoggedIn: false, isNewUser: false });
      },

      // 유저 정보 부분 업데이트
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
    }),
    {
      name: 'link-mint-auth', // 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 저장소 결정 (기본값 localStorage)
    }
  )
);