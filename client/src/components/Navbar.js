
import React from 'react';
import { Link } from 'react-router-dom';
import './../styles/Navbar.css';
import logo from "./../nav_logo.png"

function Navbar() {
    const userName = localStorage.getItem('userName');
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="logo"><img src={logo} alt="Logoimage" /></div>
                <Link to="/dashboard" className="nav-link">Home</Link>
                <Link to="/employees" className="nav-link">Employee List</Link>
            </div>
            <div className="navbar-right">
                <span className="username">Welcome, {userName}</span>
                <Link to="/logout" className="logout">Logout</Link>
            </div>
        </nav>
    );
};

export default Navbar;
