import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import './LandingPage.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';


function LandingPage() {

        const [bestSeller, setBestSeller] = useState([[], [], []]); //3 pages
        const [currentBSPage, setCurrentBSPage] = useState(0);
        const [newBooks, setNewBooks] = useState([]);
        const [isLoggedIn, setIsLoggedIn] = useState(false);
    
        useEffect(() => {
            //check for auth token to see user is logged in
            const authToken = document.cookie.includes("auth_token");
            setIsLoggedIn(authToken); 

            //fetch books for bestseller
            const fetchBestSeller = async () => {
                try {
                    let pages = [[], [], []];

                    for (let i=0; i<3; i++) {
                        const response = await fetch(`http://localhost/bookstore/bookstore_backend/features/fetch_books.php?location=landingPage&purpose=bestSeller&page=${i+1}`, {
                            method: "GET",
                            credentials: "include"
                        });

                        const data = await response.json();
                        if (data.success) {
                            pages[i] = data.books;
                        } else {
                            console.error("Failed to fetch books.");
                        }
                    }
                    setBestSeller(pages);

                } catch (error) {
                    console.error("Error fetching books:", error);
                }
            }

            const fetchNewBooks = async () => {
                try {
                    const response = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_books.php?location=landingPage&purpose=newBooks", {
                        method: "GET",
                        credentials: "include"
                    });
    
                    const data = await response.json();
                    if (data.success) {
                        setNewBooks(data.books);
                    } else {
                        console.error("Failed to fetch books.");
                    }
                } catch (error) {
                    console.error("Error fetching books:", error);
                }
            }
    
            fetchBestSeller();
            fetchNewBooks();
        }, [])

        // navigation between pages
        const goToPrevBSPage = () => setCurrentBSPage((prev) => (prev === 0 ? 2 : prev - 1));
        const goToNextBSPage = () => setCurrentBSPage((prev) => (prev === 2 ? 0 : prev + 1));

    return (
        <div className="landingPage">
            <Header />
            <div className="title">
                <h1>Welcome to BookStore</h1>
                <p>Your one-stop shop for books of all genres. Find your next great read today!</p>
                <div className="buttons">
                    <Link to="/login">Click here to login!</Link>
                </div>
            </div>

            <div className="banner">
                <img src="/banner.webp" alt="Bookstore Banner" />
            </div>

            <section className="featuredBooks">
                <h2>Best Sellers</h2>
                <button className="arrow left" onClick={goToPrevBSPage}>❮</button>

                <div className="bookContainer">
                    {bestSeller[currentBSPage].length > 0 ? (
                        bestSeller[currentBSPage].map((book) => (
                            <div key={book.id} className="book">
                                <Link to={`/book/${book.id}`}>
                                    <img src={book.image_url} className='bookCover'></img>
                                </Link>
                                <p className="bookTitle">{book.title}</p>
                                <p className="bookAuthor">{book.author}</p>
                                <p className="bookPrice">{book.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading best sellers...</p>
                    )}
                </div>

                <button className="arrow right" onClick={goToNextBSPage}>❯</button>
                <div className="dots">
                    {[0, 1, 2].map((index) => (
                        <span key={index} className={`dot ${index === currentBSPage ? "active" : ""}`} onClick={() => setCurrentBSPage(index)}></span>
                    ))}
                </div>
            </section>

            <section className="featuredBooks">
                <h2>New Books</h2>
                <div className="bookContainer">
                    {newBooks.length > 0 ? (
                        newBooks.map((book) => (
                            <div key={book.id} className="book">
                                <Link to={`/book/${book.id}`}>
                                    <img className="bookCover" src={book.image_url} alt={book.title} />
                                </Link>   
                                <p className="bookTitle">{book.title}</p>
                                <p className="bookAuthor">{book.author}</p>
                                <p className="bookPrice">{book.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading new books...</p>
                    )}
                </div>
            </section>
            <Footer />

        </div>
    );
}

export default LandingPage;
