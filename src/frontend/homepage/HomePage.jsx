import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";   
import NavBar from '../NavBar';

function HomePage() {

    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_books.php", {
                    method: "GET",
                    credentials: "include"
                });

                const data = await response.json();
                if (data.success) {
                    setBooks(data.books);
                } else {
                    setError("Failed to fetch books.");
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
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        <p>{book.price}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage;