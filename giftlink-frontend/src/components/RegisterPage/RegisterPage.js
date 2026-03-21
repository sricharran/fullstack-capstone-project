import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage() {
    // Task 4: States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Task 5: Handle register
    const handleRegister = () => {
        console.log("Register clicked");
        console.log({ firstName, lastName, email, password });
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>

                {/* Task 6: Inputs */}
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

                {/* Task 7: Button */}
                <button onClick={handleRegister}>
                    Register
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;