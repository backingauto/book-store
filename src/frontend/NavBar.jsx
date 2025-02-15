import './NavBar.css';
import logo from '../assets/bookstore_icon.webp';

function NavBar() {
    return (
        <nav className="navBar">
            <div className="navContainer">
                <img src={logo} alt="Logo" className="logo" />
                
                <div className="navLinks">
                    <button className="navButton">Dashboard</button>
                    <button className="navButton">Wishlist</button>
                    <button className="navButton">Shopping Cart</button>
                </div>
            </div>

            <div className='logoutButton'>
                <button>logout</button>
            </div>
        </nav>
    );
}

export default NavBar; 