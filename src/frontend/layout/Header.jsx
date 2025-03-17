import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <h1>BookStore</h1>
            </div>

            <nav className="nav">
                <ul>
                    <li>Home</li>
                    <li>Shop</li>
                    <li>Categories</li>
                    <li>Best Sellers</li>
                    <li>Contact</li>
                </ul>
            </nav>

            <div className="search-bar">
                <input type="text" placeholder="Search for books..." />
                <button>🔍</button>
            </div>
        </header>
    );
}

export default Header;
    