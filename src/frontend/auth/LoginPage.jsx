import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";   
import DOMPurify from "dompurify";
import './Auth.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';

function LoginPage() {

    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const sanitizeInput = (input) => DOMPurify.sanitize(input).trim();

    const handleUsernameOrEmailChange = (event) => setUsernameOrEmail(sanitizeInput(event.target.value));
    const handlePasswordChange = (event) => setPassword(sanitizeInput(event.target.value));

    const navigate = useNavigate();

    const handleForm = async (event) => {
        event.preventDefault();

        const userData = {
            usernameOrEmail: sanitizeInput(usernameOrEmail),
            password: sanitizeInput(password),
        };

        try {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                setMessage("Login Succesfully!");
                navigate("/homepage");
            } else {
                setMessage(data.message);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while logging in.");
        }

    }

    return (
        <div className='loginPage'>
            <Header />
            
            <div className='loginContainer'>
                <h2>Sign In to Your Account</h2>

                <form onSubmit={handleForm}>
                    <label htmlFor="usernameOrEmail">Username or Email</label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        value={usernameOrEmail}
                        onChange={handleUsernameOrEmailChange}
                        placeholder="Enter your username or email"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        required
                    />

                    <button type="submit">Login</button>

                    {message && <p className="message">{message}</p>}
                </form>

                <div className="authLinks">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                    <Link to="/">← Back to Landing Page</Link>
                </div>
            </div>

            <Footer />
        </div>

    )
}

export default LoginPage;