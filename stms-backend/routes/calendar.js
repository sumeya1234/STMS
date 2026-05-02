const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// GET /api/calendar?month=x&year=y (month is 1-12)
router.get('/', protect, async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return errorResponse(res, 'Month and year are required query parameters', 400);
        }

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        const startStr = startOfMonth.toISOString().slice(0, 19).replace('T', ' ');
        const endStr = endOfMonth.toISOString().slice(0, 19).replace('T', ' ');

        const [tasks] = await pool.query(
            'SELECT * FROM tasks WHERE user_id = ? AND deadline >= ? AND deadline <= ? ORDER BY deadline ASC',
            [req.user.id, startStr, endStr]
        );

        return successResponse(res, 'Calendar tasks fetched', tasks);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching calendar data', 500);
    }
});

module.exports = router;
