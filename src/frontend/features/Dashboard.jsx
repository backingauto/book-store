import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"; 

function Dashboard() {

    const [sellingBooks, setSellingBooks] = useState([]);
    const [message, setMessage] = useState("");

        useEffect(() => {
            const fetchSellingBooks = async () => {
                try {
                    const resposne = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_dashboard.php", {
                        method: "GET",
                        credentials: "include"
                    })
    
                    const data = await resposne.json();
                    if (data.success) {
                        setSellingBooks(data.sellingBooks);
                    } else {
                        setMessage("Failed to load dashboard");
                    }
    
                } catch (error) {
                    setMessage("An error occured while fetching dashboard")
                }
            }
            fetchSellingBooks();
        }, [])

    return (
        <div>
            <NavBar />

            <div className='dashboardPage'>
                <Link to="/addBook">
                    <button className='addBooksButton'>Sell books</button>
                </Link>
            </div>
            {message ? <p className="message">{message}</p> : null}

            {sellingBooks.length === 0 ? (
                <p className="empty">You are not selling books.</p>
            ) : (
                <table className="dashBoardTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>Sold</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellingBooks.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    <Link to={`/book/${book.id}`}>{book.title}</Link>
                                </td>
                                <td>{book.author}</td>
                                <td>${book.price}</td>
                                <td>{book.sold}</td>
                                <td>{book.price * book.sold}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Dashboard;