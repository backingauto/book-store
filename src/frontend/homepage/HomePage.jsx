import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";   
import "./HomePage.css";
import NavBar from "../layout/NavBar.jsx";

function HomePage() {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_books.php?location=homepage", {
                    method: "GET",
                    credentials: "include"
                });

                const data = await response.json();
                if (data.success) {
                    setBooks(data.books);
                } else {
                    console.error("Failed to fetch books.");
                }

            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }

        fetchBooks();
    }, [])

    return (
        <div className='homepage'>
            <NavBar />

            <div className='allBooksContainer'>
                {books.map((book) => (
                    <div key={book.id} className='bookContainer'>
                        <Link to={"/book/" + book.id}>
                            <img src={book.image_url} className='bookCover'></img>
                        </Link>
                        <h3 className='bookTitle'> {book.title}</h3>
                        <p className='bookAuthor'>{book.author}</p>
                        <p className='bookPrice'>{book.price}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage;