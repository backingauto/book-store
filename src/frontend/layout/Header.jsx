import './Header.css';

function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <ul>
                    <li>Home</li>
                    <li>Categories</li>
                    <li>Account</li>
                </ul>
            </nav>

            <div className="logo">
                <h1>BookStore</h1>
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search for books..." />
                <button>🔍</button>
            </div>


        </header>
    );
}

export default Header;
    