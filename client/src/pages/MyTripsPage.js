import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import './MyTripsPage.css';

const MyTripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    
    // --- 1. ADD NEW LOADING STATE (to track *which* trip is deleting) ---
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await api.get('/api/trips');
                setTrips(res.data);
            } catch (err) {
                setError('Failed to fetch your trips. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    // --- 2. UPDATE Handle Delete Function ---
    const handleDelete = async (tripId) => {
        setDeletingId(tripId); // <-- Set loading for this specific trip
        try {
            await api.delete(`/api/trips/${tripId}`);
            setTrips(prevTrips => prevTrips.filter(trip => trip._id !== tripId));
        } catch (err) {
            console.error("Error deleting trip:", err);
            setError("Failed to delete trip. Please try again.");
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null); // <-- Stop loading
        }
    };

    const filteredTrips = useMemo(() => {
        let tempTrips = [...trips];
        if (searchTerm) {
            tempTrips = tempTrips.filter(trip =>
                trip.destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.destination.country.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortBy === 'budget-asc') {
            tempTrips.sort((a, b) => a.budget - b.budget);
        } else if (sortBy === 'budget-desc') {
            tempTrips.sort((a, b) => b.budget - a.budget);
        }
        return tempTrips;
    }, [trips, searchTerm, sortBy]);


    if (loading) return <div className="loading-text">Loading your trips...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="page-container my-trips-page">
            <h1 className="my-trips-title">My Adventures</h1>

            {trips.length > 0 && (
                <div className="trips-filter-container">
                    <div className="filter-group">
                        <label htmlFor="search">Search Destination</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="e.g., Paris, Japan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort">Sort By</label>
                        <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="latest">Latest</option>
                            <option value="budget-asc">Budget (Low to High)</option>
                            <option value="budget-desc">Budget (High to Low)</option>
                        </select>
                    </div>
                </div>
            )}
            
            {trips.length === 0 ? (
                <div className="no-trips-card">
                    <h2>You haven't planned any trips yet.</h2>
                    <p>What are you waiting for?</p>
                    <Link to="/planner" className="btn-primary">Plan a Trip</Link>
                </div>
            ) : filteredTrips.length === 0 ? (
                <div className="no-trips-card">
                    <h2>No trips match your filter.</h2>
                    <p>Try adjusting your search or sort criteria.</p>
                </div>
            ) : (
                <div className="trips-grid">
                    {filteredTrips.map(trip => {
                        // --- 3. CHECK IF THIS CARD'S BUTTON IS LOADING ---
                        const isDeleting = deletingId === trip._id;
                        
                        return (
                            <div key={trip._id} className="trip-card">
                                <Link to={`/itinerary/${trip._id}`} className="trip-card-clickable-area">
                                    <div className="trip-card-header">
                                        <span className="trip-card-sub">Trip To</span>
                                        <h2>{trip.destination.city}, {trip.destination.country}</h2>
                                    </div>
                                    <div className="trip-card-body">
                                        <p>
                                            <strong>Date:</strong> 
                                            {new Date(trip.startDate).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Budget:</strong> 
                                            ${trip.budget}
                                        </p>
                                    </div>
                                </Link>
                                
                                {/* --- 4. UPDATE THE BUTTON'S JSX --- */}
                                <div className="trip-card-footer">
                                    <button 
                                        onClick={() => handleDelete(trip._id)} 
                                        className={`trip-card-delete-btn ${isDeleting ? 'deleting' : ''}`}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Trip'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyTripsPage;

