// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport'); // 1. Import Passport
const { registerUser, loginUser, googleCallback } = require('../controllers/authController');

// Defines the POST routes for registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- 2. ADD GOOGLE AUTH ROUTES ---

// @desc    Auth with Google
// @route   GET /api/auth/google
// This is the route your "Sign in with Google" button will link to
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // What we want to get from Google
}));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
// Google will redirect to this route after user logs in
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }), // If it fails, send back to login
    googleCallback // If it succeeds, run our controller
);

module.exports = router;
