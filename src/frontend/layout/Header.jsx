import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

function Header({ isLoggedIn = false, onLogout }) {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');

    const protectedLink = (path) => (isLoggedIn ? path : '/login');

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost/bookstore/bookstore_backend/auth/logout.php', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                if (onLogout) { 
                    onLogout();
                }
                navigate('/');
            } else {
                alert('Logout failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging out.');
        }
    };

    const handleSearch = () => {
        const trimmedKeyword = searchKeyword.trim();

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (trimmedKeyword !== '') {
            navigate('/homepage?search=' + encodeURIComponent(trimmedKeyword));
        } else {
            navigate('/homepage');
        }
    }

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="header">
            <nav className="nav">
                <ul>
                    <li><Link to="/" className="headerLink">Home</Link></li>

                    <li><Link to={protectedLink('/dashboard')} className="headerLink">Sell Book</Link></li>
                    <li><Link to={protectedLink('/wishListPage')} className="headerLink">Wishlist</Link></li>
                    <li><Link to={protectedLink('/shoppingCartPage')} className="headerLink">Shopping Cart</Link></li>
                    <li><Link to={protectedLink('/purchaseHistoryPage')} className="headerLink">Purchase History</Link></li>
                    <li><Link to={protectedLink('/reviewPage')} className="headerLink">Review History</Link></li>
                </ul>
            </nav>

            <div className="logo">
                <h1>BookStore</h1>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
                <button onClick={handleSearch}>🔍</button>

                {isLoggedIn ? (
                    <button className="authButton" onClick={handleLogout}>Logout</button>
                ) : (
                    <Link to="/login" className="authButton linkButton">Login</Link>
                )}

            </div>


        </header>
    );
}

export default Header;
    