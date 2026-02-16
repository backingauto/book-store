import { Link, useNavigate, useSearchParams  } from 'react-router-dom';
import { useState, useEffect, useMemo } from "react";   
import "./HomePage.css";
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';

function HomePage() {

    const [books, setBooks] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchKeyword = searchParams.get('search')?.trim() ?? '';

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
                    console.error("Failed to fetch books.");
                }

            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }

        fetchBooks();
    }, [])

    // for search function
    const filteredBooks = useMemo(() => {
        if (!searchKeyword) {
            return books;
        }

        const lowercaseKeyword = searchKeyword.toLowerCase();

        // return the book if it contains the keyword
        return books.filter((book) => {
            const searchableText = [book.title, book.author, book.genre, book.dedescription]
                .filter(Boolean)    // remove null
                .join(' ')          // make it into one string
                .toLowerCase();

            return searchableText.includes(lowercaseKeyword);
        })

    }, [books, searchKeyword]);

    return (
        <div className='homepage'>
            <Header isLoggedIn />

            {searchKeyword && (
                <p className='searchResultText'>
                    Search results for: <strong>{searchKeyword}</strong>
                </p>
            )}

            {!filteredBooks.length && searchKeyword ? (
                <p className='searchResultText'>No books found for that keyword.</p>
            ) : (
                <div className='allBooksContainer'>
                    {filteredBooks.map((book) => (
                        <div key={book.id} className='bookContainer'>
                            <Link to={'/book/' + book.id}>
                                <img src={book.image_url} className='bookCover'></img>
                            </Link>
                            <h3 className='bookTitle'> {book.title}</h3>
                            <p className='bookAuthor'>{book.author}</p>
                            <p className='bookPrice'>${book.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HomePage;