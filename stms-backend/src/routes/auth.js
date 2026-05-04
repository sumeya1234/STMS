const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkAuth = require('../middleware/auth');

// Wait... ensure inputValidator is plugged in later, for now we let controller do basic validation
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.put('/profile', checkAuth, authController.updateProfile);
router.put('/update-password', checkAuth, authController.updatePassword);
router.delete('/account', checkAuth, authController.deleteAccount);

module.exports = router;
