const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { errorResponse } = require('../utils/responseHelper');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const [users] = await pool.query('SELECT id, name, email, university, department, year, email_verified FROM users WHERE id = ?', [decoded.id]);

            if (users.length === 0) {
                return errorResponse(res, 'Not authorized, user not found', 401);
            }

            req.user = users[0];
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return errorResponse(res, 'Not authorized, token failed', 401);
        }
    }

    if (!token) {
        return errorResponse(res, 'Not authorized, no token', 401);
    }
};

module.exports = { protect };
