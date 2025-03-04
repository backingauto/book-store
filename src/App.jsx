import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './frontend/auth/RegisterPage';
import LoginPage from './frontend/auth/LoginPage';
import LandingPage from './frontend/homepage/LandingPage'
import HomePage from './frontend/homepage/HomePage';
import Dashboard from './frontend/features/Dashboard';
import AddBook from './frontend/features/AddBook';
import BookPage from './frontend/book/BookPage';


function App() {

  return (
    <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/book/:bookId" element={<BookPage />} />
        </Routes>
    </HashRouter>
  )
}

export default App
