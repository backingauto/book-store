import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"; 
import NavBar from '../layout/NavBar';

function WishListPage() {

    const [wishlist, setWishlist] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const resposne = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_wishlist.php", {
                    method: "POST",
                    credentials: "include"
                })

                const data = await resposne.json();
                if (data.success) {
                    setWishlist(data.wishlist);
                } else {
                    setMessage("Failed to load wishlist");
                }

            } catch (error) {
                setMessage("An error occured while fetching wishlist")
            }
        }
        fetchWishlist();
    }, [])

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
            console.error("Error removing book from wishlist: ", error);
        }
    }
    return (
        <div className="wishlistPage">
            <NavBar />
            <h1>Your Wishlist</h1>

            {message ? <p className="message">{message}</p> : null}

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
                                    <button className="removeButton" onClick={() => removeFromWishlist(book.id)}>
                                        Remove
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