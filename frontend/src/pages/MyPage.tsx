// src/pages/MyPage.tsx
import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function MyPage() {
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    api.get("/users/me")
        .then((res)=> {
            console.log(res)
            setUserId(res.data)
        }
        )
        .catch(()=> console.log("nono"));
    
  }, []);

  return <div>내 유저 ID: {userId}</div>;
}
