import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import Header from '../layout/Header';
import { addToShoppingCart } from '../book/BookPage';

function WishListPage() {

    const [wishlist, setWishlist] = useState([]);
    const [message, setMessage] = useState("");
    const [cartMessage, setCartMessage] = useState('');
    const [addingBookId, setAddingBookId] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_wishlist.php", {
                    method: "POST",
                    credentials: "include"
                });

                const data = await response.json();
                if (data.success) {
                    setWishlist(data.wishlist);
                } else {
                    setMessage("Failed to load wishlist");
                }

            } catch (error) {
                setMessage("An error occurred while fetching wishlist");
            }
        };

        fetchWishlist();
    }, []);

    const removeFromWishlist = async (bookId) => {
        try {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/book/update_wishlist.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId })
            });

            const data = await response.json();

            if (data.success) {
                setWishlist(data.wishlist);
            } else {
                console.error("Failed to update wishlist.");
            }

        } catch (error) {
            console.error("Error removing book from wishlist:", error);
        }
    };

    const handleAddToCart = async (bookId) => {
        setAddingBookId(bookId);
        setCartMessage('');

        const success = await addToShoppingCart(bookId, null, 1);

        if (success) {
            setCartMessage('1 book added to cart!');
        } else {
            setCartMessage('Failed to add to cart.');
        }

        setAddingBookId(null);
    };

    return (
        <div className="wishlistPage">
            <Header isLoggedIn />
            <h1>Your Wishlist</h1>

            {message && <p className="message">{message}</p>}
            {cartMessage && <p className="message" role="status">{cartMessage}</p>}

            {wishlist.length === 0 ? (
                <p className="empty">Your wishlist is empty.</p>
            ) : (
                <table className="wishlistTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlist.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    <Link to={`/book/${book.id}`}>{book.title}</Link>
                                </td>
                                <td>{book.author}</td>
                                <td>${book.price}</td>
                                <td>
                                    <button
                                        className="removeButton"
                                        onClick={() => removeFromWishlist(book.id)}
                                    >
                                        Remove
                                    </button>

                                    <button
                                        className="wishlistCartButton"
                                        onClick={() => handleAddToCart(book.id)}
                                        disabled={addingBookId !== null}
                                    >
                                        {addingBookId === book.id ? 'Adding...' : 'Add to shopping cart'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default WishListPage;
