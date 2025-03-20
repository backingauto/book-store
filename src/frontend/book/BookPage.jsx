import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"; 
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import "./BookPage.css";


export const addToShoppingCart = async (bookId, setInShoppingCart) => {
    try {
        const response = await fetch("http://localhost/bookstore/bookstore_backend/book/update_cart.php", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId, action: "add" })
        });
        const data = await response.json();
        if (data.success) {
            setInShoppingCart(prevCount => prevCount + 1);
        } else {
            console.error("Failed to update ShoppingCart.");
        }
        
    } catch (error) {
        console.error("Error updating ShoppingCart:", error);
    }
}

export const removeFromShoppingCart = async (bookId, setInShoppingCart) => {
    try {
        const response = await fetch("http://localhost/bookstore/bookstore_backend/book/update_cart.php", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId, action: "remove" })
        });
        const data = await response.json();
        if (data.success) {
            setInShoppingCart(prevCount => prevCount - 1);
        } else {
            console.error("Failed to update ShoppingCart.");
        }
        
    } catch (error) {
        console.error("Error updating ShoppingCart:", error);
    }
}

function BookPage() {

    const { bookId } = useParams();

    const [book, setBook] = useState(null);
    const [message, setMessage] = useState("");
    const [wishlist, setWishList] = useState(false);
    const [inShoppingCart, setInShoppingCart] = useState(0);   //number of this book in the shopping cart
    const [stock, setStock] = useState(0);
    
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    //user review section
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                const response = await fetch(`http://localhost/bookstore/bookstore_backend/book/fetch_book_info.php?id=${bookId}`, {
                    method: "GET",
                    credentials: "include"
                });

                const data = await response.json();
                console.log(data)
                if (data.success) {
                    setBook(data.book);
                    setWishList(data.isWishlist);
                    setInShoppingCart(data.inShoppingCart);
                    setStock(data.book.stock);
                    setRating(data.book.rating);
                    setReviews(data.reviews || []);
                } else {
                    setMessage("Failed to load book info.");
                }

            } catch (error) {
                setMessage("An error occurred wihle fetching book info...");
            }
        }
        console.log(reviews);
        fetchBookInfo();
    }, [bookId])

    if (message) {
        return <p className='message'>{message}</p>;
    }

    if (!book) {
        return <p className="loading">Loading book details...</p>;
    }

    const toggleWishlist = async () => {
        try {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/book/update_wishlist.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId })
            });
            const data = await response.json();
            if (data.success) {
                setWishList(data.wishlist);
            } else {
                console.error("Failed to update wishlist.");
            }
            

        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    }

    const submitReview = async (event) => {
        event.preventDefault();
        if (userRating === 0 || userReview.trim() === "") {
            alert("Please provide a rating and a review.");
            return;
        }
        try {

            const response = await fetch("http://localhost/bookstore/bookstore_backend/book/submit_review.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, rating: userRating, review: userReview })
            });

            const data = await response.json();
            if (data.success) {
                setReviews([...reviews, { rating: userRating, review: userReview }]);
                setUserRating(0);
                setUserReview("");
                alert("Submit review successfully.");
            } else {
                alert("Failed to submit review.");
            }
        } catch (error) {
            alert("Error submitting review:", error);
        }
    }

    return (
        <div className='bookPage'>
            <NavBar />

            <div className='bookInfo'>
                <img src={book.image_url} alt={book.title} className="bookCover" />
                <div className='bookDetails'>
                    <h1 className="bookTitle">{book.title}</h1>
                    <h2 className="bookAuthor">by {book.author}</h2>
                    <p className="bookPrice">${book.price}</p>
                    <p className="bookDescription">{book.description}</p>
                    <p className="bookStock">Stock Available: {book.stock}</p>
                    <p className="bookRating">
                        Rating: {book.rating > 0 ? book.rating : "N/A"}
                    </p>
                </div>
            </div>
            <hr />
            <br />
            <button className="wishlist_button" onClick={toggleWishlist}>
                {wishlist ? <FaHeart/> : <FaRegHeart/>}
                {wishlist ? " Remove from wishlist" : " Add to wishlist"}
            </button>
            <br />
            <br />

            <div className='shoppingCartControls'>
                <p>Shopping Cart</p>
                <button className="cartButton" onClick={() => removeFromShoppingCart(bookId, setInShoppingCart)} disabled={inShoppingCart === 0}>-</button>
                <span className="cartQuantity">{inShoppingCart}</span>
                <button 
                className="cartButton" 
                onClick={() => addToShoppingCart(bookId, setInShoppingCart)}
                disabled={inShoppingCart >= stock}>
                +</button>
            </div>

            <br />
            <hr />
            <div className='reviewSection'>
                <h2>Write a Review</h2>
                {message && <p className="message">{message}</p>}

                <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                            key={star} 
                            className={userRating >= star ? "star selected" : "star"}
                            onClick={() => setUserRating(star)}
                            style={{ cursor: "pointer", color: userRating >= star ? "#FFD700" : "#C0C0C0" }}
                        />
                    ))}
                </div>
                <input 
                    type='text'
                    placeholder="Write your review..." 
                    value={userReview} 
                    onChange={(e) => setUserReview(e.target.value)}
                />
                <button onClick={submitReview}>Submit Review</button>
            </div>

            <br />
            <hr />

            <div className="reviews">
                <h2>Reviews</h2>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="review">
                            <p className="reviewRating">{"⭐".repeat(review.rating)}</p>
                            <p className="reviewReview">{review.review}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )

}

export default BookPage;