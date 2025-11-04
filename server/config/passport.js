// server/config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
                proxy: true // Trust proxy to allow http/https
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                };

                try {
                    // Check if user already exists
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // User found, log them in
                        done(null, user);
                    } else {
                        // Check if user exists with this email (but not Google ID)
                        user = await User.findOne({ email: profile.emails[0].value });
                        if (user) {
                            // This email is already taken
                            // We can't link it automatically, so return an error
                            // Or, you could link them by setting user.googleId = profile.id;
                            // For now, we'll return an error to prevent conflicts
                            console.log("Email already exists, can't link Google ID automatically.");
                            return done(new Error('Email already registered. Please log in with your password.'), false);
                        } else {
                            // Create new user
                            user = await User.create(newUser);
                            done(null, user);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    done(err, false);
                }
            }
        )
    );

    // These are required for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
