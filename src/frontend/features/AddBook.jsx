import './Dashboard.css';
import { useState } from "react";  
import DOMPurify from "dompurify";
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

function AddBook() {

    const navigate = useNavigate();
    
    const [message, setMessage] = useState("");
    const [cover, setCover] = useState(null);

    const handleFileChange = (event) => {
        setCover(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append("title", DOMPurify.sanitize(event.target.title.value));
        formData.append("author", DOMPurify.sanitize(event.target.author.value));
        formData.append("genre", DOMPurify.sanitize(event.target.genre.value));
        formData.append("price", DOMPurify.sanitize(event.target.price.value));
        formData.append("stock", DOMPurify.sanitize(event.target.stock.value));
        formData.append("description", DOMPurify.sanitize(event.target.description.value));
        if (cover) {
            formData.append("cover", cover);
        } else {
            setMessage("Please upload a cover");
            return;
        }

        try {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/features/add_book.php", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                setMessage("Book uploaded successfully! Redirecting to homepage");
                navigate("/homepage");
            } else {
                setMessage(result.error || "Failed to upload book.");
            }

        } catch (error) {
            setMessage("error uploading book, please try again" + error);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="addBookPage">
                <h2>Sell a Book</h2>
                <form onSubmit={handleSubmit} className="addBookForm">
                    <div className="form-grid">
                        <div>
                            <label>Book Title</label>
                            <input type="text" name="title" placeholder="book title" required />
                        </div>
    
                        <div>
                            <label>Author</label>
                            <input type="text" name="author" placeholder="author name" required />
                        </div>
    
                        <div>
                            <label>Genre</label>
                            <input type="text" name="genre" placeholder="genre" />
                        </div>
    
                        <div>
                            <label>Price ($)</label>
                            <input type="number" name="price" placeholder="price" required />
                        </div>
    
                        <div>
                            <label>Stock Quantity</label>
                            <input type="number" name="stock" placeholder="stock quantity" required />
                        </div>
    
                        <div className="full-width">
                            <label>Description</label>
                            <textarea name="description" placeholder="book description" required />
                        </div>
    
                        <div className="full-width">
                            <label>Upload Cover</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} required />
                        </div>
                    </div>
    
                    <button type="submit">Submit</button>
                </form>
    
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default AddBook;