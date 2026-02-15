import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import RegisterPage from './frontend/auth/RegisterPage';
import LoginPage from './frontend/auth/LoginPage';
import LandingPage from './frontend/homepage/LandingPage'
import HomePage from './frontend/homepage/HomePage';
import Dashboard from './frontend/features/Dashboard';
import AddBook from './frontend/features/AddBook';
import BookPage from './frontend/book/BookPage';
import WishListPage from './frontend/features/WishListPage';
import ShoppingCartPage from './frontend/features/ShoppingCartPage';
import PurchaseHistoryPage from './frontend/features/PurchaseHistoryPage';
import ReviewPage from './frontend/features/ReviewPage';


// check if login
function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState('checking');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost/bookstore/bookstore_backend/features/fetch_books.php?location=landingPage&purpose=bestSeller', {
          method: 'GET',
          credentials: 'include'
        });

        const data = await response.json();
        setAuthStatus(data.success ? 'authenticated' : 'unauthenticated');
      } catch {
        setAuthStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  if (authStatus === 'checking') {
    return <p>Checking login status...</p>;
  }

  return authStatus === 'authenticated' ? children : <Navigate to="/login" replace />;
}


function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/addbook" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
        <Route path="/book/:bookId" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
        <Route path="/wishListPage" element={<ProtectedRoute><WishListPage /></ProtectedRoute>} />
        <Route path="/shoppingCartPage" element={<ProtectedRoute><ShoppingCartPage /></ProtectedRoute>} />
        <Route path="/purchaseHistoryPage" element={<ProtectedRoute><PurchaseHistoryPage /></ProtectedRoute>} />
        <Route path="/reviewPage" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />

      </Routes>


    </BrowserRouter>
  )
}

export default App
