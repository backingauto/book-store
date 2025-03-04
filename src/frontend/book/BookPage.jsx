    import { Link, useParams, useNavigate } from 'react-router-dom';
    import { useState, useEffect } from "react";   
    import NavBar from '../NavBar';
    import "./BookPage.css";

    function BookPage() {

        const { bookId } = useParams();

        const [book, setBook] = useState(null);
        const [message, setMessage] = useState("");

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
            </div>
        )

    }

    export default BookPage;