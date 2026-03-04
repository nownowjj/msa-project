import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 또는 true로 설정 가능
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8002",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            // 🔥 Authorization 헤더 전달 강제
            if (req.headers.authorization) {
              proxyReq.setHeader(
                "authorization",
                req.headers.authorization
              );
            }
          });
        },
      },
    },
  },
});