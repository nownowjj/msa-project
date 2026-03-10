import axios from "axios";
import { useAlertStore } from "../store/useAlertStore";

export const api = axios.create({
  // VITE_API_BASE_URL이 있으면 그 값을 쓰고, 없으면 로컬 프록시용 "/api" 사용
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 1. 요청 인터셉터 (기존 로직 유지)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. 응답 인터셉터 추가 (에러 감시자)
api.interceptors.response.use(
  (response) => {
    // 성공 응답 (200대)은 그대로 통과
    return response;
  },
  async (error) => {
    // 에러 발생 시 처리 (401, 403, 500 등)
    const { response } = error;
    console.log(response)

    if (response && response.status === 401) {
      // 서버에서 보낸 JSON 바디의 code 확인 (백엔드 sendErrorResponse에서 보낸 값)
      const errorCode = response.data.code;

      let isAlerting = false; // 알림창이 이미 떠 있는지 확인하는 플래그

      if (errorCode === "TOKEN_EXPIRED") {
        isAlerting = true;
        const { showAlert } = useAlertStore.getState();
        await showAlert(`로그인 세션이 만료되었습니다.\n다시 로그인해주세요.`);
        isAlerting = false; // 확인 후 해제
        localStorage.removeItem("token"); // 저장된 토큰 삭제
        
        // 현재 페이지가 로그인이 아닌 경우에만 리다이렉트 (무한 루프 방지)
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    // 에러를 던져서 호출한 곳(React Query 등)에서도 에러를 알 수 있게 함
    return Promise.reject(error);
  }
);
