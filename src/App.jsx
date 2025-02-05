import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './frontend/navBar/NavBar'
import LandingPage from './frontend/homepage/LandingPage'
import RegisterPage from './frontend/auth/RegisterPage';
import LoginPage from './frontend/auth/LoginPage';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
