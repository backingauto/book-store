import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";  
import DOMPurify from "dompurify";
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

        const formData = formData();

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
            const response = await fetch("http://localhost/bookstore_backend/features/add_book.php", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                setMessage("Book uploaded successfully!");
            } else {
                setMessage(result.error || "Failed to upload book.");
            }

        } catch (error) {
            setMessage("error uploading book, please try again");
        }
    }

    return (
        <div>
            <NavBar />
            <div className='addBookPage'>
                <h2>Sell a Book</h2>
                <form onSubmit={handleSubmit} className="sellBookForm">
                    <input type="text" name="title" placeholder="Book Title" required />
                    <input type="text" name="author" placeholder="Author" required />
                    <input type="text" name="genre" placeholder="Genre" />
                    <input type="number" name="price" placeholder="Price ($)" required />
                    <input type="number" name="stock" placeholder="Stock Quantity" required />
                    <textarea name="description" placeholder="Book Description"></textarea>
                    <input type="file" accept="image/*" onChange={handleFileChange} required />

                    <button type="submit">Submit</button>
                </form>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    )
}

export default AddBook;