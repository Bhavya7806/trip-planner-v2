// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    googleId: { // --- 1. ADDED GOOGLE ID ---
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    password: { // --- 2. PASSWORD IS NO LONGER ALWAYS REQUIRED ---
        type: String,
        required: function() { 
            // Only require password if googleId is not set
            return !this.googleId; 
        },
        minlength: 6,
        select: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// This function will run before the user is saved to the database
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    // AND it's not a Google user (who won't have a password)
    if (!this.isModified('password') || !this.password) {
        next();
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
