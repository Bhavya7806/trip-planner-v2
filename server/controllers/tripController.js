const Trip = require('../models/Trip');
const axios = require('axios');

// --- Shuffle function to randomize attractions ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// @desc    Create a new trip
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
    try {
        const { startLocation, destination, startDate, endDate, people, budget } = req.body;

        console.log(`[Trip Controller] Received destination: ${destination.city}, ${destination.country}`);

        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const diffTime = Math.abs(eDate - sDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        const dailyBudget = Math.floor(budget / diffDays);

        let attractions = [];
        try {
            const geocodeRes = await axios.get('https://api.geoapify.com/v1/geocode/search', {
                params: {
                    text: `${destination.city}, ${destination.country}`,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            });

            const placeId = geocodeRes.data.features[0]?.properties.place_id;

            if (placeId) {
                console.log(`[Trip Controller] Found placeId: ${placeId}`);
                
                const placesRes = await axios.get('https://api.geoapify.com/v2/places', {
                    params: {
                        categories: 'tourism.sights',
                        filter: `place:${placeId}`,
                        limit: 50, 
                        apiKey: process.env.GEOAPIFY_API_KEY
                    }
                });

                if (placesRes.data.features && placesRes.data.features.length > 0) {
                    attractions = placesRes.data.features.map(place => place.properties.name);
                    shuffleArray(attractions); 
                    console.log(`[Trip Controller] Found and shuffled ${attractions.length} attractions.`);
                } else {
                    console.log("[Trip Controller] Found placeId, but no attractions for that place.");
                }
            } else {
                console.log(`[Trip Controller] WARNING: Could not find placeId for ${destination.city}. Using placeholders.`);
            }
        } catch (apiError) {
            console.error("------------------------------------------------------");
            console.error("[Trip Controller] CATCH BLOCK EXECUTED: Geoapify API call failed.", apiError.message);
            console.error("------------------------------------------------------");
            attractions = ["a historic landmark", "the main street", "a local market"];
        }

        // --- Build the Itinerary ---
        let sampleItinerary = [];

        for (let i = 1; i <= diffDays; i++) {
            let dailyActivities = [];

            // --- NEW: Improved logic to REUSE attractions with modulo operator ---
            if (attractions.length > 0) {
                const attraction1 = attractions[(i * 2 - 2) % attractions.length];
                dailyActivities.push(`Visit ${attraction1}`);
                
                if (attractions.length > 1) {
                    const attraction2 = attractions[(i * 2 - 1) % attractions.length];
                    if (attraction1 !== attraction2) {
                         dailyActivities.push(`Explore ${attraction2}`);
                    }
                }
            } else {
                dailyActivities.push("Explore the city center");
            }
            
            dailyActivities.push("Dinner at a highly-rated local restaurant");

            let transportSuggestion = 'Use local transport for sightseeing.';
            if (i === 1) {
                transportSuggestion = `Travel from ${startLocation.city} to ${destination.city}.`;
            }

            sampleItinerary.push({
                day: i,
                activities: dailyActivities,
                accommodation: `Find a hotel near ${destination.city} center.`,
                transport: transportSuggestion,
                dailyBudget: dailyBudget
            });
        }

        // --- Save the Trip ---
        const newTrip = new Trip({
            user: req.user.id,
            startLocation,
            destination,
            startDate,
            endDate,
            people,
            budget,
            itineraryPlan: sampleItinerary
        });

        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single trip by ID
// @route   GET /api/trips/:id
exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Trip not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Get all trips for the logged-in user
// @route   GET /api/trips
exports.getUserTrips = async (req, res) => {
    try {
        // Find all trips where the 'user' field matches the logged-in user's ID
        // Sort by 'createdAt' in descending order (newest first)
        const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        if (!trips) {
            return res.status(200).json([]); // Return an empty array if no trips
        }

        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION ---
// @desc    Delete a trip
// @route   DELETE /api/trips/:id
exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        // Check if the user owns the trip
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Find and delete the trip
        await Trip.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Trip removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Trip not found' });
        }
        res.status(500).send('Server Error');
    }
};

