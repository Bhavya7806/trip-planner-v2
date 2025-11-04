import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Your updated api.js file
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './TripForm.css';

const TripForm = () => {
    const navigate = useNavigate();

    // --- 1. ADD NEW LOADING STATE ---
    const [isCreating, setIsCreating] = useState(false);

    // All of your existing state and useEffect hooks remain the same...
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [startCountries, setStartCountries] = useState([]);
    const [startStates, setStartStates] = useState([]);
    const [startCities, setStartCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedStartCountry, setSelectedStartCountry] = useState(null);
    const [selectedStartState, setSelectedStartState] = useState(null);
    const [selectedStartCity, setSelectedStartCity] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [formData, setFormData] = useState({ adults: 1, children: 0, budget: '' });
    const formatForSelect = (data) => data.map(item => ({ value: item.isoCode || item.name, label: item.name, ...item }));
    useEffect(() => { const allCountries = Country.getAllCountries(); setCountries(formatForSelect(allCountries)); setStartCountries(formatForSelect(allCountries)); }, []);
    useEffect(() => { if (selectedCountry) { setStates(formatForSelect(State.getStatesOfCountry(selectedCountry.value))); setSelectedState(null); setCities([]); setSelectedCity(null); } }, [selectedCountry]);
    useEffect(() => { if (selectedCountry && selectedState) { setCities(formatForSelect(City.getCitiesOfState(selectedCountry.value, selectedState.value))); setSelectedCity(null); } }, [selectedCountry, selectedState]);
    useEffect(() => { if (selectedStartCountry) { setStartStates(formatForSelect(State.getStatesOfCountry(selectedStartCountry.value))); setSelectedStartState(null); setStartCities([]); setSelectedStartCity(null); } }, [selectedStartCountry]);
    useEffect(() => { if (selectedStartCountry && selectedStartState) { setStartCities(formatForSelect(City.getCitiesOfState(selectedStartCountry.value, selectedStartState.value))); setSelectedStartCity(null); } }, [selectedStartCountry, selectedStartState]);

    const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setIsCreating(true); // <-- 2. SET LOADING TRUE
        const tripData = {
            startLocation: { country: selectedStartCountry?.label, state: selectedStartState?.label, city: selectedStartCity?.label },
            destination: { country: selectedCountry?.label, state: selectedState?.label, city: selectedCity?.label },
            startDate, endDate, people: { adults: formData.adults, children: formData.children }, budget: formData.budget
        };
        try {
            const res = await api.post('/api/trips', tripData); 
            navigate(`/itinerary/${res.data._id}`);
        } catch (err) {
            console.error('Error creating trip:', err.response?.data);
            alert('Failed to save trip. Please try again.');
        } finally {
            setIsCreating(false); // <-- 3. SET LOADING FALSE (even if it fails)
        }
    };

    const customSelectStyles = { control: (provided) => ({ ...provided, minHeight: '48px', borderRadius: '8px', border: '1px solid var(--light-gray)' }) };

    return (
        <div className="trip-form-container">
            <h2>Plan Your Next Adventure</h2>
            <form onSubmit={handleSubmit}>
                {/* ... (all your form groups) ... */}
                <div className="form-group">
                    <label>Starting From (Your Home)</label>
                    <div className="destination-inputs">
                        <Select options={startCountries} value={selectedStartCountry} onChange={setSelectedStartCountry} placeholder="Select Country" styles={customSelectStyles} required />
                        <Select options={startStates} value={selectedStartState} onChange={setSelectedStartState} placeholder="Select State" styles={customSelectStyles} isDisabled={!selectedStartCountry} required />
                        <Select options={startCities} value={selectedStartCity} onChange={setSelectedStartCity} placeholder="Select City" styles={customSelectStyles} isDisabled={!selectedStartState} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Destination</label>
                    <div className="destination-inputs">
                        <Select options={countries} value={selectedCountry} onChange={setSelectedCountry} placeholder="Select Country" styles={customSelectStyles} required />
                        <Select options={states} value={selectedState} onChange={setSelectedState} placeholder="Select State" styles={customSelectStyles} isDisabled={!selectedCountry} required />
                        <Select options={cities} value={selectedCity} onChange={setSelectedCity} placeholder="Select City" styles={customSelectStyles} isDisabled={!selectedState} required />
                    </div>
                </div>
                <div className="form-group form-row">
                    <div className="date-picker-wrapper">
                        <label>Arrival Date</label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} className="date-input" placeholderText="Select date" required />
                    </div>
                    <div className="date-picker-wrapper">
                        <label>Departure Date</label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} className="date-input" placeholderText="Select date" required />
                    </div>
                </div>
                <div className="form-group form-row">
                    <div><label>Adults</label><input type="number" name="adults" value={formData.adults} onChange={handleInputChange} min="1" required /></div>
                    <div><label>Children</label><input type="number" name="children" value={formData.children} onChange={handleInputChange} min="0" required /></div>
                </div>
                <div className="form-group">
                    <label>Your Budget ($)</label>
                    <input type="number" placeholder="e.g., 1500" name="budget" value={formData.budget} onChange={handleInputChange} required />
                </div>
                
                {/* --- 4. UPDATE THE BUTTON --- */}
                <button 
                    type="submit" 
                    className={`submit-btn ${isCreating ? 'is-loading' : ''}`}
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating Your Itinerary...' : 'Create Itinerary'}
                </button>
            </form>
        </div>
    );
};

export default TripForm;

