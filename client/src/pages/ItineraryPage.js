import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Your updated api.js file
// We no longer need AuthContext
import './ItineraryPage.css';

const ItineraryPage = () => {
    const { tripId } = useParams();
    // const { token } = useContext(AuthContext); // <-- REMOVED
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                // We no longer need the 'config' object
                // const config = { headers: { 'Authorization': `Bearer ${token}` } }; <-- REMOVED
                
                // The token is added automatically by api.js
                const res = await api.get(`/api/trips/${tripId}`); 
                setTrip(res.data);
            } catch (err) {
                console.error("Error fetching trip:", err.response?.data);
                setError('Failed to fetch itinerary.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTrip(); // We can call this directly
    }, [tripId]); // We no longer need 'token' as a dependency

    if (loading) return <div className="loading-text">Generating Your Adventure...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!trip) return <div className="loading-text">Itinerary not found.</div>;

    // --- This part is important ---
    // If the itineraryPlan doesn't exist, show a message.
    if (!trip.itineraryPlan || trip.itineraryPlan.length === 0) {
        return (
            <div className="page-container">
                 <div className="itinerary-page-container">
                    <div className="itinerary-header-card">
                        <span className="header-sub">TRIP TO</span>
                        <h1>{trip.destination?.city}, {trip.destination?.country}</h1>
                        <div className="header-details">
                            <span>🗓️ {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                            <span>💰 Budget: ${trip.budget}</span>
                            <span>✈️ From: {trip.startLocation?.city}</span>
                        </div>
                    </div>
                    <div className="loading-text" style={{paddingTop: '2rem'}}>
                        This trip has been saved, but the AI itinerary hasn't been generated yet.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">
            <div className="itinerary-page-container">
                <div className="itinerary-header-card">
                    <span className="header-sub">TRIP TO</span>
                    <h1>{trip.destination?.city}, {trip.destination?.country}</h1>
                    <div className="header-details">
                        <span>🗓️ {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                        <span>💰 Budget: ${trip.budget}</span>
                        <span>✈️ From: {trip.startLocation?.city}</span>
                    </div>
                </div>
                
                <div className="timeline-container">
                    {trip.itineraryPlan.map((day, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-dot">
                                <div className="timeline-day-number">{day.day}</div>
                            </div>
                            <div className="timeline-content-card">
                                <h2>Day {day.day}</h2>
                                <div className="timeline-section">
                                    <h4>Transport</h4>
                                    <p>🚗 {day.transport}</p>
                                </div>
                                <div className="timeline-section">
                                    <h4>Activities</h4>
                                    <ul>
                                        {day.activities?.map((activity, i) => (
                                            <li key={i}>- {activity}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="timeline-section">
                                    <h4>Accommodation</h4>
                                    <p>🏨 {day.accommodation}</p>
                                </div>
                                <div className="timeline-section">
                                    <h4>Daily Budget</h4>
                                    <p>💵 Approx. ${day.dailyBudget} for expenses.</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItineraryPage;
