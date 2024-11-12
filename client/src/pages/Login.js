import React, { useState } from 'react';
import axios from 'axios';
import './../styles/Login.css';
import PreNav from '../components/PreNav';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                f_userName: userName,
                f_Pwd: password
            });

            localStorage.setItem('token', response.data.token);
            alert(response.data.message);
            setError('');
            localStorage.setItem('userName', userName);
            window.location.href = '/dashboard';

        } catch (err) {
            setError('Invalid login details');
        }
    };

    return (
        <div><PreNav/>
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
        </div>
    );
};

export default Login;
