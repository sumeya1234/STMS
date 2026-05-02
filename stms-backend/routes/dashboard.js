const express = require('express');
const router = express.Router();
const { getDashStats, getDashOverdue, getDashUpcoming } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all dashboard endpoints

router.get('/stats', getDashStats);
router.get('/overdue', getDashOverdue);
router.get('/upcoming', getDashUpcoming);

module.exports = router;
