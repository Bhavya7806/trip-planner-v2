const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '365d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        // Check password, but only if the user doesn't have a googleId
        // If they have a googleId, they should use Google to sign in
        if (!user.googleId) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
        } else {
             // User exists but has a Google ID, so password login is disabled
            return res.status(400).json({ msg: 'This account uses Google Sign-in.' });
        }
        
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '365d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- 1. NEW GOOGLE CALLBACK FUNCTION ---
// @desc    Google auth callback
// @route   GET /api/auth/google/callback
exports.googleCallback = (req, res) => {
    // This function runs after passport.js logic in config/passport.js
    // req.user is populated by passport
    const payload = {
        user: {
            id: req.user.id,
        },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '365d' },
        (err, token) => {
            if (err) throw err;
            // Redirect user back to the frontend with the token
            // We'll create a new frontend route to handle this
            res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?token=${token}`);
        }
    );
};

