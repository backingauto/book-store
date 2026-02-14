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

            <div className="registerContent">
                <div className="registerContainer">
                    <h1>Create an Account</h1>
                    <h2>Please enter your info</h2>

                    <form onSubmit={handleForm}>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            placeholder="Enter your username"
                            onChange={handleUsernameChange}
                            required
                        />

                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={handleEmailChange}
                            required
                        />

                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={handlePasswordChange}
                            required
                        />

                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="password2"
                            value={password2}
                            placeholder="Renter your password"
                            onChange={handlePassword2Change}
                            required
                        />

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>

            <div className="registerFooter">
                <p>Already have an account?</p>
                <Link to="/login">Click here to login!</Link>
                <br />
                <Link to="/">Go back to home</Link>
            </div>

            <Footer />
        </div>
    );
}

export default RegisterPage;