import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"; 
import { FaHeart, FaRegHeart } from "react-icons/fa";
import NavBar from '../NavBar';
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

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                const response = await fetch(`http://localhost/bookstore/bookstore_backend/book/fetch_book_info.php?id=${bookId}`, {
                    method: "GET",
                    credentials: "include"
                });

                const data = await response.json();
                if (data.success) {
                    setBook(data.book);
                    setWishList(data.isWishlist);
                    setInShoppingCart(data.inShoppingCart);
                } else {
                    console.error("Failed to load book info.");
                    setMessage("Failed to load book info.");
                }

            } catch (error) {
                console.error("Error fetching book: ", error);
                setMessage("An error occurred wihle fetching book info...");
            }
        }

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
                </div>
            </div>

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
                <button className="cartButton" onClick={() => addToShoppingCart(bookId, setInShoppingCart)}>+</button>
            </div>
        </div>
    )

}

export default BookPage;