// src/pages/Login.tsx
import { useState } from "react";
import { api } from "../api/api";

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
    </div>
  );
}
