import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"; 
import NavBar from '../layout/NavBar';

function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("http://localhost/bookstore/bookstore_backend/features/fetch_reviews.php", {
                    method: "GET",
                    credentials: "include"
                })

                const data = await response.json();
                if (data.success) {
                    setReviews(data.reviews);
                } else {
                    setMessage("Failed to load reviews");
                }

            } catch (error) {
                setMessage("An error occured while fetching reviews")
            }
        }
        fetchReviews();
    }, [])

    const removeReview = async (reviewId) => {

        try {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/features/remove_review.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId })
            });

            const data = await response.json();
            if (data.success) {
                setReviews(prevReviews => prevReviews.filter(review => review.review_id !== reviewId)); //new array without the review
                setMessage("Review has been deleted.");
            } else {
                setMessage("Failed to remove review.");
            }
        } catch (error) {
            setMessage("Error removing review:", error);
        }
    };

    return (
        <div className="reviewPage">
            <NavBar />
            <h1>Your review history</h1>

            {message ? <p className="message">{message}</p> : null}

            {reviews.length === 0 ? (
                <p className="empty">Your haven't leave a review yet.</p>
            ) : (
                <table className="reviewTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>rating</th>
                            <th>comment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review.review_id}>
                                <td>
                                    <Link to={`/book/${review.book_id}`}>{review.title}</Link>
                                </td>
                                <td>{review.author}</td>
                                <td>{review.rating}</td>
                                <td>{review.review}</td>
                                <td>
                                    <button className="removeButton" onClick={() => removeReview(review.review_id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

}

export default ReviewPage;