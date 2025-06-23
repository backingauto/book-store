import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import DOMPurify from "dompurify";
import './Auth.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';


function RegisterPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const sanitizeInput = (input) => DOMPurify.sanitize(input).trim();

    const handleUsernameChange = (event) => setUsername(sanitizeInput(event.target.value));
    const handleEmailChange = (event) => setEmail(sanitizeInput(event.target.value));
    const handlePasswordChange = (event) => setPassword(sanitizeInput(event.target.value));
    const handlePassword2Change = (event) => setPassword2(sanitizeInput(event.target.value));

    const navigate = useNavigate();

    const handleForm = async (event) => {
        event.preventDefault();

        if (password != password2) {
            alert("Passwords do not match!");
            return;
        }

        const userData = {
            username: sanitizeInput(username),
            email: sanitizeInput(email),
            password: sanitizeInput(password),
        };

        try {
            const response = await fetch("http://localhost/bookstore/bookstore_backend/auth/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (data.success) {
                alert("Registration successful! Redirecting to login...");
                navigate("/login");
            } else {
                alert(data.message || "Registration failed");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering.");
        }

    }

    return (
        <div className="registerPage">
            <Header />

            <div className="registerContainer">
                <h2>Create an Account</h2>
                <p>Please enter your information to register</p>

                <form onSubmit={handleForm}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Choose a username"
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter a password"
                        required
                    />

                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={password2}
                        onChange={handlePassword2Change}
                        placeholder="Confirm your password"
                        required
                    />

                    <button type="submit" style={{ marginTop: '20px' }}>Register</button>
                </form>

                <div className="authLinks">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                    <Link to="/">← Back to Landing Page</Link>
                </div>
            </div>

            <Footer />
        </div>

    )
}

export default RegisterPage;