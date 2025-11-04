// trip-planner-backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport'); // 1. Import Passport
const session = require('express-session'); // 2. Import express-session

// Route files
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

dotenv.config();

// 3. Import Passport config *after* dotenv
require('./config/passport')(passport);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// 4. --- PASSPORT & SESSION MIDDLEWARE ---
// This must be a temporary session, as we are using JWTs
// It's just needed for the Google OAuth handshake
app.use(session({
    secret: process.env.SESSION_SECRET, // Add this to .env
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
// --- END OF MIDDLEWARE ---

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
