import './NavBar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/bookstore_icon.webp';

function NavBar() {
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
                    
                    <button className="navButton">Wishlist</button>
                    <button className="navButton">Shopping Cart</button>
                    <button className="navButton">Purchase History</button>
                </div>
            </div>

            <div className='logoutButton'>
                <button>logout</button>
            </div>
        </nav>
    );
}

export default NavBar; 