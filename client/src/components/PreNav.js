
import React from 'react';
import { Link } from 'react-router-dom';
import './../styles/PreNav.css';
import logo from "./../nav_logo.png"

function PreNav() {
   
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="logo"><img src={logo} alt="Logoimage" /></div>
                <span className="username">Welcome</span>
               
            </div>
            <div className="navbar-right">
                
                <Link to="/logout" className="logout">LogIn</Link>
                <Link to="/register" className="logout">Register</Link>
            </div>
        </nav>
    );
};

export default PreNav;
