// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import './HomePage.css'; // <-- This line is essential for loading the styles

const HomePage = () => {
    return (
        <>
            <div className="home-container">
                <div className="hero-section">
                    <h1>Your Adventure Awaits</h1>
                    <p>Tell us your destination, budget, and travel dates. Our AI will handle the rest, crafting a unique, personalized itinerary just for you. Effortless planning, unforgettable journeys.</p>
                    <div className="call-to-action">
                        <h2>To create your itinerary, please log in or create an account.</h2>
                        <div className="cta-buttons">
                            <Link to="/login" className="btn btn-primary">Login</Link>
                            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>

            <section className="features-section">
                <h2>Why Choose Us?</h2>
                <div className="features-grid">
                    <FeatureCard 
                        icon="💡" 
                        title="Smart Suggestions" 
                        text="Get intelligent, budget-aware recommendations for transport and activities." 
                    />
                    <FeatureCard 
                        icon="🗺️" 
                        title="Personalized Plans" 
                        text="Every itinerary is tailored to your dates, destination, and starting point." 
                    />
                    <FeatureCard 
                        icon="✅" 
                        title="Simple & Fast" 
                        text="Plan your entire trip in just a few minutes with our easy-to-use interface." 
                    />
                </div>
            </section>
        </>
    );
};

export default HomePage;