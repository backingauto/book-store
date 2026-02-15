import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import './LandingPage.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';


function LandingPage() {

        const [bestSeller, setBestSeller] = useState([]);
        const [newBooks, setNewBooks] = useState([]);
    
        useEffect(() => {
            const fetchBestSeller = async () => {
                try {
                    const response = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_books.php?location=landingPage&purpose=bestSeller", {
                        method: "GET",
                        credentials: "include"
                    });
    
                    const data = await response.json();
                    if (data.success) {
                        setBestSeller(data.books);
                    } else {
                        console.error("Failed to fetch books.");
                    }
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
                <div className="bookContainer">
                    {bestSeller.length > 0 ? (
                        bestSeller.map((book) => (
                            <div key={book.id} className="book">
                                <Link to={"/book/" + book.id}>
                                    <img src={book.image_url} className='bookCover'></img>
                                </Link>
                                <p className="bookTitle">{book.title}</p>
                                <p className="bookAuthor">{book.author}</p>
                                <p className="bookPrice">${book.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading best sellers...</p>
                    )}
                </div>
            </section>

            <section className="featuredBooks">
                <h2>New Books</h2>
                <div className="bookContainer">
                    {newBooks.length > 0 ? (
                        newBooks.map((book) => (
                            <div key={book.id} className="book">
                                <img className="bookCover" src={book.image_url} alt={book.title} />
                                <p className="bookTitle">{book.title}</p>
                                <p className="bookAuthor">{book.author}</p>
                                <p className="bookPrice">${book.price}</p>
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
