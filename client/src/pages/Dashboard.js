import React from 'react';
import './../styles/Dashboard.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const userName = localStorage.getItem('userName'); 

    return (
        <div>
            <Navbar/>
            <div className="dashboard-container">
            <div className="welcome-message">
                <h1>Welcome to the Admin Panel</h1>
                <h2>Hello, <span className="username">{userName || "User"}</span></h2>
            </div>
        </div>
        </div>
        
    );
};

export default Dashboard;
