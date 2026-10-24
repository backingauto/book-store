
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import './ProfilePage.css';

function ProfilePage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [detailsPassword, setDetailsPassword] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    //fetch account info
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost/bookstore/bookstore_backend/auth/profile.php', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    setUsername(data.username);
                    setEmail(data.email);
                } else {
                    setMessage(data.message || 'Failed to load account');
                }
            } catch (error) {
                setMessage('Failed to load account');
            }
        };

        fetchProfile();
    }, []);

    //update username and email
    const handleUpdateDetails = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost/bookstore/bookstore_backend/auth/profile.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateDetails',
                    username,
                    email,
                    currentPassword: detailsPassword
                })
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.success) {
                setDetailsPassword('');
            }
        } catch (error) {
            setMessage('Failed to update account');
        }

        setSaving(false);
    };

    //change password
    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost/bookstore/bookstore_backend/auth/profile.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'changePassword',
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.success) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setMessage('Failed to change password');
        }

        setSaving(false);
    };

    return (
        <div className="profilePage">
            <Header isLoggedIn />

            <main className="profileContainer">
                <h1>Account Settings</h1>

                {message && <p className="profileMessage" role="status">{message}</p>}

                <form onSubmit={handleUpdateDetails} className="profileForm">
                    <h2>Personal Information</h2>

                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label>Current Password</label>
                    <input
                        type="password"
                        value={detailsPassword}
                        onChange={(event) => setDetailsPassword(event.target.value)}
                        required
                    />

                    <button type="submit" disabled={saving}>Save Changes</button>
                </form>

                <form onSubmit={handleChangePassword} className="profileForm">
                    <h2>Change Password</h2>

                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        required
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        minLength={8}
                        required
                    />

                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                    />

                    <button type="submit" disabled={saving}>Change Password</button>
                </form>

                <section className="profileLinks">
                    <h2>My Activity</h2>
                    <Link to="/dashboard">My Listed Books</Link>
                    <Link to="/purchaseHistoryPage">Purchase History</Link>
                </section>
            </main>
        </div>
    );
}

export default ProfilePage;
