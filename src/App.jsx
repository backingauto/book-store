import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom';
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
          <Route path="/wishListPage" element={<WishListPage />} />
          <Route path="/shoppingCartPage" element={<ShoppingCartPage />} />
          <Route path="/purchaseHistoryPage" element={<PurchaseHistoryPage />} />
          <Route path="/reviewPage" element={<ReviewPage />} />
        </Routes>
    </HashRouter>
  )
}

export default App
