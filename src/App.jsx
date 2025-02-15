import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './frontend/auth/RegisterPage';
import LoginPage from './frontend/auth/LoginPage';
import LandingPage from './frontend/homepage/LandingPage'
import HomePage from './frontend/homepage/HomePage';
import Dashboard from './frontend/features/Dashboard';
import SellBook from './frontend/features/SellBook'


function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sellbook" element={<SellBook />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
