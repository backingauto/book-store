import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <h1>BookStore</h1>
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search for books..." />
            </div>

            <nav className="nav">
                <ul>
                    <li>Home</li>
                    <li>Categories</li>
                    <li>Account</li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
    