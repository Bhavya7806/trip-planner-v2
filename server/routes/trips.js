const express = require('express');
const router = express.Router();

// --- 1. IMPORT ALL FOUR FUNCTIONS ---
const { 
    createTrip, 
    getTripById, 
    getUserTrips, 
    deleteTrip // <-- Import the new function
} = require('../controllers/tripController');

const { protect } = require('../middleware/authMiddleware');

// --- 2. ADD THE ROUTES ---

// GET /api/trips (fetching all user's trips)
// This MUST come BEFORE the '/:id' route
router.get('/', protect, getUserTrips);

// POST /api/trips (creating a trip)
router.post('/', protect, createTrip);

// GET /api/trips/some_id (fetching a single trip)
router.get('/:id', protect, getTripById);

// DELETE /api/trips/some_id (deleting a trip)
router.delete('/:id', protect, deleteTrip); // <-- Add the new delete route

module.exports = router;

