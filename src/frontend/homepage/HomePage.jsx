import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";   

function HomePage() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost/bookstore_backend/auth/logout.php", {
                method: "POST"
            });

            const data = await response.json();

            if (data.success) {
                navigate("/");
            } else {
                alert("Logout failed: " + data.message);
            }            
            
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while logging out.");
        }
    }

    return (
        <div className='homepage'>
            <div>   
                <p>home page</p>
            </div>

            <div className='logout_button'>
                <button onClick={handleLogout}>logout</button>
            </div>
        </div>
    )
}

export default HomePage;