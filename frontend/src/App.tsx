import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import MyPage from './pages/MyPage'

function App() {
  console.log('CLIENT ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);


  return (
    <BrowserRouter>
     <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
