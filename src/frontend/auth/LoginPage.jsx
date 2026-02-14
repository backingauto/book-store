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
        <div className="loginPage">
            <Header />

            <div className="loginContent">
                <div className="loginContainer">
                    <h1>Welcome Back</h1>
                    <h2>Please login to continue</h2>

                    <form onSubmit={handleForm}>
                        <label>Username/Email:</label>
                        <input
                            type="text"
                            name="usernameOrEmail"
                            value={usernameOrEmail}
                            onChange={handleUsernameOrEmailChange}
                            placeholder="Enter your username or email"
                            required
                        />

                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            required
                        />

                        <button type="submit">Login</button>
                    </form>

                    {message && <p className="message">{message}</p>}
                </div>
            </div>

            <div className="loginFooter">
                <p>No account?</p>
                <Link to="/register">Click here to sign up!</Link>
                <br />
                <Link to="/">Go back to home</Link>
            </div>

            <Footer />
        </div>
    );

}

export default LoginPage;