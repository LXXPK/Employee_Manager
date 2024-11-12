
import React, { useEffect, useState } from "react";
import Logo from "./../Logo.png";
import "./../styles/Initial.css";
import PreNav from "../components/PreNav";

const Initial = () => {
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
      
        const timer = setTimeout(() => setShowOptions(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div><PreNav/>
        <div className="initial-container">
            {!showOptions ? (
                <div className="logo-animation">
                    <img src={Logo} alt="DD Logo" className="animated-logo" />
                </div>
            ) : (
                <div className="welcome-section">
                    <h1>Welcome to DealsDray</h1>
                    <div className="auth-buttons">
                        <button onClick={() => window.location.href = '/login'}>Login</button>
                        <button onClick={() => window.location.href = '/register'}>Register</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Initial;
