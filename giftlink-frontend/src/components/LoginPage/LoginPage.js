import React, { useState } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { setIsLoggedIn } = useAppContext();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError('');

            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            // Task 1: Access JSON response
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            // Task 2: Store in sessionStorage
            sessionStorage.setItem('auth-token', data.authtoken);

            // Task 3: Update global state
            setIsLoggedIn(true);

            // Task 4: Navigate to MainPage
            navigate('/app');

        } catch (err) {
            // Task 5: Set error message
            setError("Something went wrong");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Task 6: Display error */}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <input
                            type="email"
                            className="form-control mb-3"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;