const express = require('express');
const router = express.Router();
const { getMe, updateProfile, getPreferences, updatePreferences } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

router.get('/me/preferences', protect, getPreferences);
router.put('/me/preferences', protect, updatePreferences);

module.exports = router;
