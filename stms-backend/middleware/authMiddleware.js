const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { errorResponse } = require('../utils/responseHelper');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return errorResponse(res, 'Not authorized, no token', 401);
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await pool.query(
            'SELECT id, name, email, university, department, year, email_verified FROM users WHERE id = ?',
            [decoded.id]
        );
        if (users.length === 0) return errorResponse(res, 'User not found', 401);
        req.user = users[0];
        next();
    } catch (error) {
        return errorResponse(res, 'Not authorized, token failed', 401);
    }
};

module.exports = { protect };
