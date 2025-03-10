import './NavBar.css';
import logo from '../assets/bookstore_icon.webp';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/auth/logout.php", {
                method: "POST"
            });

            const data = await response.json();

            if (data.success) {
                navigate("/");
            } else {
                alert("Logout failed: " + data.message);
            }            
            
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while logging out.");
        }
    }

    return (
        <nav className="navBar">
            <div className="navContainer">
                <Link to="/homepage">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                
                
                <div className="navLinks">
                    <Link to="/dashboard">
                        <button className="navButton">Dashboard</button>
                    </Link>
                    <Link to="/wishListPage">
                        <button className="navButton">Wishlist</button>
                    </Link>
                    <Link to="/ShoppingCartPage">
                        <button className="navButton">Shopping Cart</button>
                    </Link>
                    <Link to="/PurchaseHistoryPage">
                        <button className="navButton">Purchase History</button>
                    </Link>
                    <Link to="/reviewPage">
                        <button className="navButton">Review History</button>
                    </Link>
                </div>
            </div>

            <div className='logoutButton'>
                <button onClick={handleLogout}>logout</button>
            </div>
        </nav>
    );
}

export default NavBar; 