import { Link, useNavigate  } from 'react-router-dom';
import { useState, useEffect } from "react";
import './LandingPage.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';

const MAX_PAGES_TO_FETCH = 3;

function LandingPage() {

    const navigate = useNavigate();

    const [bestSeller, setBestSeller] = useState([]);
    const [currentBSPage, setCurrentBSPage] = useState(0);

    const [newBooks, setNewBooks] = useState([]);
    const [currentNewPage, setCurrentNewPage] = useState(0);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isBestSellerLoading, setIsBestSellerLoading] = useState(true);
    const [isNewBooksLoading, setIsNewBooksLoading] = useState(true);


    useEffect(() => {
        // check if login
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost/bookstore/bookstore_backend/auth/check_auth.php", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setIsLoggedIn(Boolean(data.success));
            } catch {
                setIsLoggedIn(false);
            }
        };

        // fetch books for bestseller (3 pages)
        const fetchBestSeller = async () => {
            try {
                const pages = [];

                for (let i=0; i< MAX_PAGES_TO_FETCH; i++) {
                    const response = await fetch(`http://localhost/bookstore/bookstore_backend/features/fetch_books.php?location=landingPage&purpose=bestSeller&page=${i + 1}`, {
                        method: "GET",
                        credentials: "include"
                    });

                    const data = await response.json();
                    if (data.success) {
                        if (data.books.length > 0) {
                            pages.push(data.books);
                        }
                    } else {
                        console.error("Failed to fetch books.");
                    }
                }

                setBestSeller(pages);
                setCurrentBSPage(0);
            } catch (error) {
                console.error("Error fetching books: ", error);
                setBestSeller([]);
            } finally {
                setIsBestSellerLoading(false);
            }
        }

        // fetch books for new books (3 pages)
        const fetchNewBooks = async () => {
            try {
                const pages = [];
                
                for (let i = 0; i < MAX_PAGES_TO_FETCH; i++) {
                    const response = await fetch(`http://localhost/bookstore/bookstore_backend/features/fetch_books.php?location=landingPage&purpose=newBooks&page=${i + 1}`, {
                        method: "GET",
                        credentials: "include"
                    });

                    const data = await response.json();
                    if (data.success) {
                        if (data.books.length > 0) {
                            pages.push(data.books);
                        }

                    } else {
                        console.error("failed to fetch new books.");
                    }

                }
                setNewBooks(pages);
                setCurrentNewPage(0);

            }  catch (error) {
                console.error("Error fetching new books:", error);
                setNewBooks([]);
            } finally {
                setIsNewBooksLoading(false);
            }
        }

        checkAuth();
        fetchBestSeller();
        fetchNewBooks();
    }, [])

    const bestSellerPageCount = bestSeller.length;
    const newBooksPageCount = newBooks.length;

    const goToPrevBSPage = () => setCurrentBSPage((prev) => (prev === 0 ? bestSellerPageCount - 1 : prev - 1));
    const goToNextBSPage = () => setCurrentBSPage((prev) => (prev === bestSellerPageCount - 1 ? 0 : prev + 1));
    const goToPrevNewPage = () => setCurrentNewPage((prev) => (prev === 0 ? newBooksPageCount - 1 : prev - 1));
    const goToNextNewPage = () => setCurrentNewPage((prev) => (prev === newBooksPageCount - 1 ? 0 : prev + 1));


    // requires login to view book
    const handleBookClick = (bookId) => {
        navigate(isLoggedIn ? `/book/${bookId}` : '/login');
    };


    return (
        <div className="landingPage">
            <Header isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
            <div className="title">
                <h1>Welcome to BookStore</h1>
                <p>Your one-stop shop for books of all genres. Find your next great read today!</p>
                {!isLoggedIn && (
                    <div className="buttons">
                        <Link to="/login">Click here to login!</Link>
                    </div>
                )}
            </div>

            <div className="banner">
                <img src="/banner.webp" alt="Bookstore Banner" />
            </div>

            <section className="featuredBooks">
                <h2>Best Sellers</h2>
                <div className="bestSellerRow">
                    <button className="arrow left" onClick={goToPrevBSPage} disabled={bestSellerPageCount <= 1}>❮</button>

                    <div className="bookContainer">
                        {isBestSellerLoading ? (
                            <p>Loading best sellers...</p>
                        ) : bestSellerPageCount > 0 ? (
                            bestSeller[currentBSPage].map((book) => (
                                <div key={book.id} className="book">
                                    <img
                                        src={book.image_url}
                                        className='bookCover'
                                        alt={book.title}
                                        onClick={() => handleBookClick(book.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <p className="bookTitle">{book.title}</p>
                                    <p className="bookAuthor">{book.author}</p>
                                    <p className="bookPrice">${book.price}</p>
                                </div>
                            ))
                        ) : (
                            <p>No best sellers available...</p>
                        )}
                    </div>

                    <button className="arrow right" onClick={goToNextBSPage} disabled={bestSellerPageCount <= 1}>❯</button>
                </div>
            </section>

            <section className="featuredBooks">
                <h2>New Books</h2>
                <div className="newBooksRow">
                    <button className="arrow left" onClick={goToPrevNewPage} disabled={newBooksPageCount <= 1}>❮</button>

                    <div className="bookContainer">
                        {isNewBooksLoading ? (
                            <p>Loading new books...</p>
                        ) : newBooksPageCount > 0 ? (
                            newBooks[currentNewPage].map((book) => (
                                <div key={book.id} className="book">
                                    <img
                                        src={book.image_url}
                                        className='bookCover'
                                        alt={book.title}
                                        onClick={() => handleBookClick(book.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <p className="bookTitle">{book.title}</p>
                                    <p className="bookAuthor">{book.author}</p>
                                    <p className="bookPrice">${book.price}</p>
                                </div>
                            ))
                        ) : (
                            <p>No new books available...</p>
                        )}
                    </div>

                    <button className="arrow right" onClick={goToNextNewPage} disabled={newBooksPageCount <= 1}>❯</button>
                </div>
            </section>

            <div className="viewAllBooks">
                <button onClick={() => navigate(isLoggedIn ? '/homepage' : '/login')}>
                    {isLoggedIn ? 'View all books' : 'Login to view all books'}
                </button>
            </div>

            <Footer />

        </div>
    );
}

export default LandingPage;
