import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"; 

function PurchaseHistoryPage() {

    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const resposne = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_history.php", {
                    method: "GET",
                    credentials: "include"
                })

                const data = await resposne.json();
                if (data.success) {
                    setPurchaseHistory(data.purchaseHistory);
                } else {
                    setMessage("Failed to load purchaseHistory");
                }

            } catch (error) {
                setMessage("An error occured while fetching purchaseHistory")
            }
        }
        fetchPurchaseHistory();
    }, [])

    return (
        <div className="purchaseHistoryPage">
            <NavBar />
            <h1>Your Purchase History</h1>
    
            <p className="message">{message}</p>
    
            {purchaseHistory.length === 0 ? (
                <p className="empty">You have no purchase history.</p>
            ) : (
                <table className="purchaseHistoryTable">
                    <thead>
                        <tr>
                            <th>Purchase Time</th>
                            <th>Books</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseHistory.map((record, index) => (
                            <tr key={index}>
                                <td>{record.time}</td>
                                <td>{record.books}</td>
                                <td>${record.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
    
}


export default PurchaseHistoryPage;