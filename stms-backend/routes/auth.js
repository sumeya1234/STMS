const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, verifyEmail, forgotPassword, resetPassword, logout } = require('../controllers/authController');
const { generateToken } = require('../utils/tokenUtils');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),
    (req, res) => {
        // Successful authentication
        const token = generateToken(req.user.id);
        // We can redirect to frontend with token in URL since we use session:false 
        // Example: http://localhost:5173/oauth-callback?token=xxx
        res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
    }
);

module.exports = router;
