import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import MyPage from './pages/MyPage'

function App() {
  

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
