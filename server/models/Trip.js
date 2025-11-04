// trip-planner-backend/models/Trip.js
const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    startLocation: { // <-- ADDED THIS SECTION
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true }
    },
    destination: {
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true }
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    people: {
        adults: { type: Number, required: true, min: 1 },
        children: { type: Number, default: 0 }
    },
    budget: {
        type: Number,
        required: true
    },
    // In trip-planner-backend/models/Trip.js
//...
itineraryPlan: {
    type: [{
        day: Number,
        activities: [String],
        accommodation: String,
        transport: String,
        dailyBudget: Number // <-- ADD THIS LINE
    }],
    default: []
},
//...
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trip', TripSchema);