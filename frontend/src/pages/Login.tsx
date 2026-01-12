// src/pages/Login.tsx
import { useState } from "react";
import { api } from "../api/api";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import YoutubeConnectButton from "../components/YoutubeConnectButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    console.log("ㄱㄱ");
    const res = await api.post("/auth/login", { email, password });
    console.log(res);
    localStorage.setItem("token", res.data.accessToken);
    alert("로그인 성공");
   };

  // ✅ Google 로그인 성공
  const handleGoogleLoginSuccess = async (idToken: string) => {
    console.log('Google ID Token:', idToken);

    // 🔜 다음 단계: api-service로 전달
    const res = await api.post('/auth/google', {
      idToken,
    });

    localStorage.setItem('token', res.data.accessToken);
    alert('Google 로그인 성공');
  };

  // ❌ Google 로그인 실패
  const handleGoogleLoginError = () => {
    alert('Google 로그인 실패');
  };


  const useGoogleLoginSuccess= async (code: String)=>{
    // 🔜 다음 단계: api-service로 전달
    const res = await api.post('/auth/google', {
      code
    });

    localStorage.setItem('token', res.data.accessToken);
    alert('Google 로그인 성공');
  }


  return (
    <div>
      <h2>Login</h2>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <button onClick={login}>Login</button>

      {/* <button onClick={googleLogin}>Google 로그인</button> */}

      {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLoginButton
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
      </GoogleOAuthProvider> */}
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {/* <GoogleLoginButton
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        /> */}

        {/* 👇 이거만 추가 */}
        <YoutubeConnectButton
          onSuccess={(code) => {
            // 서버로 전달
            console.log(`code = ${code}`)
            useGoogleLoginSuccess(code);
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
}
