import React, { useState } from 'react';
import './RegisterPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async () => {
        try {
            setError('');

            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Task 6
                headers: {
                    'Content-Type': 'application/json' // Task 7
                },
                body: JSON.stringify({ // Task 8
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            // Save token
            sessionStorage.setItem('auth-token', data.authtoken);

            // Update global state
            setIsLoggedIn(true);

            // Redirect
            navigate('/app');

        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleRegister}>
                    Register
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;