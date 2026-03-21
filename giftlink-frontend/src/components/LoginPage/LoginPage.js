import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {

    // Task 4: States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Task 5: Handle login
    const handleLogin = () => {
        console.log("Login clicked");
        console.log({ email, password });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Task 6: Inputs */}
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

                        {/* Task 7: Button */}
                        <button
                            className="btn btn-primary btn-block"
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;