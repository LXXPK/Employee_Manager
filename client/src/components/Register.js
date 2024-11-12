import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './../styles/Register.css'
import PreNav from './PreNav';

const Register = () => {
    const [serialNo, setSerialNo] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); 
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                f_sno: serialNo,
                f_userName: userName,
                f_Pwd: password,
            });

            setMessage(response.data.message);

            setError(''); 
            setSerialNo('');
            setUserName('');
            setPassword('');

           
            setTimeout(() => {
                navigate('/login');  
            }, 2000); 

        } catch (err) {
            setMessage('');
            setError(err.response.data.message || 'Something went wrong');
        }
    };

    return (
        <div><PreNav/>
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Serial Number:</label>
                    <input
                        type="text"
                        value={serialNo}
                        onChange={(e) => setSerialNo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        className='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
        </div>
    );
};

export default Register;
