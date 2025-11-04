import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css'; // <-- This line is essential for loading the styles

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);

    const authLinks = (
        <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/planner" className="nav-link">Planner</Link>
            {/* --- NEW LINK ADDED HERE --- */}
            <Link to="/my-trips" className="nav-link">My Trips</Link>
            <button onClick={logout} className="nav-link-button">Logout</button>
        </div>
    );

    const guestLinks = (
        <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link-button">Sign Up</Link>
        </div>
    );

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
            
                <svg
                    xmlns="%PUBLIC_URL%/LOGO.png"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2z" />
                </svg>
                <span>TripPlanner</span>
            </Link>
            {isAuthenticated ? authLinks : guestLinks}
        </nav>
    );
};

export default Navbar;
