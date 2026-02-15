import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"; 
import { addToShoppingCart, removeFromShoppingCart } from "../book/BookPage";
import NavBar from '../layout/NavBar';


function ShoppingCartPage() {

    const [inShoppingCart, setInShoppingCart] = useState(0);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchShoppingCart = async () => {
            try {
                const resposne = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_cart.php", {
                    method: "POST",
                    credentials: "include"
                })

                const data = await resposne.json();
                if (data.success) {
                    setShoppingCart(data.shoppingCart);
                    setInShoppingCart(data.shoppingCart["quantity"])
                } else {
                    setMessage("Failed to load shoppingCart");
                }

            } catch (error) {
                setMessage("An error occured while fetching shoppingCart")
            }
        }
        fetchShoppingCart();
    }, [inShoppingCart])

    const handleCheckout = async () => {
        const confirmCheckout = window.confirm("Are you sure you want to check out?");
        
        if (confirmCheckout) {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/features/checkout.php", {
                method: "POST",
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                alert("You have checked out.");
                navigate("/homepage");
            } else {
                console.error("Failed to checkout");
            }
        }
    };
    

    return (
        <div className="shoppingCartPage">
            <NavBar />
            <h1>Your Shopping Cart</h1>
    
            {message ? <p className="message">{message}</p> : null}
    
            {shoppingCart.length === 0 ? (
                <p className="empty">Your shopping cart is empty.</p>
            ) : (
                <table className="shoppingCartTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shoppingCart.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    <Link to={`/book/${book.id}`}>{book.title}</Link>
                                </td>
                                <td>{book.author}</td>
                                <td>${book.price}</td>
                                <td>{book.quantity}</td>
                                <td>${(book.price * book.quantity)}</td>
                                <td>
                                    <button className="cartButton" onClick={() => removeFromShoppingCart(book.id, setInShoppingCart)} disabled={book.quantity === 0}>-</button>
                                    <button className="cartButton" onClick={() => addToShoppingCart(book.id, setInShoppingCart)}>+</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            {shoppingCart.length > 0 && (
                <div className="checkoutSection">
                    <p>Total Cost: <strong>${shoppingCart.reduce((total, book) => total + book.price * book.quantity, 0)}</strong></p>
                    <button className="checkoutButton" onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
            )}

        </div>
    );
    

}

export default ShoppingCartPage;