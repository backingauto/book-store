import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import DOMPurify from "dompurify";
import './Auth.css';


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
        <div className='registerPage'>

            <div className='registerContainer'>
                <h1>Create an Account</h1>
                <h2>Please enter your info</h2>
                <br/>
                <br/>

                <form onSubmit={handleForm}>
                    <label>Username:</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={email} onChange={handleEmailChange} required />

                    <label>Password:</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} required />

                    <label>Confirm Password:</label>
                    <input type="password" name="password2" value={password2} onChange={handlePassword2Change} required />

                    <br/>
                    <button type="submit">Register</button>
                </form>
            </div>
            <p>already have an account? <br/><Link to="/login">Click here to login!</Link></p>
            <Link to="/">Go back to home</Link>
        </div>
    )
}

export default RegisterPage;