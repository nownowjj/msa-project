import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // 모든 요청에 쿠키를 포함 (설정 유지)
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
  (error) => {
    // 에러 발생 시 처리 (401, 403, 500 등)
    const { response } = error;
    console.log(response)

    if (response && response.status === 401) {
      // 서버에서 보낸 JSON 바디의 code 확인 (백엔드 sendErrorResponse에서 보낸 값)
      const errorCode = response.data.code;

      if (errorCode === "TOKEN_EXPIRED") {
        // 이직 포인트: 사용자에게 명확한 안내 후 세션 정리
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        
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