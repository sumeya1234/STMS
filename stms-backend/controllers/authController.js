const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken, generateVerificationToken } = require('../utils/tokenUtils');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const Joi = require('joi');

const register = async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).pattern(/^[A-Za-z\s]+$/).required()
                .messages({ 'string.pattern.base': 'Name must only contain letters and spaces', 'string.min': 'Name must be at least 3 characters' }),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required()
                .messages({ 'string.pattern.base': 'Password must contain at least 8 characters, one uppercase, one number and one special character' }),
            university: Joi.string().pattern(/^[A-Za-z\s\-',.]+$/).allow('', null)
                .messages({ 'string.pattern.base': 'University should not contain numbers' }),
            department: Joi.string().pattern(/^[A-Za-z\s\-',.]+$/).allow('', null)
                .messages({ 'string.pattern.base': 'Department should not contain numbers' }),
            year: Joi.string().allow('', null)
        });

        const { error } = schema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { name, email, password, university, department, year } = req.body;

        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return errorResponse(res, 'User already exists with this email', 400);

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const verificationToken = generateVerificationToken();

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, university, department, year, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, passwordHash, university || null, department || null, year || null, verificationToken]
        );

        const userId = result.insertId;

        // Insert default categories
        const defaultCategories = [
            ['Assignment', 'assignment'],
            ['Exam', 'exam'],
            ['Project', 'project'],
            ['Personal', 'personal']
        ];

        for (const [catName, catType] of defaultCategories) {
            await pool.query(
                'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
                [userId, catName, catType]
            );
        }

        // Send verification email via Nodemailer
        await sendVerificationEmail(email, verificationToken);

        // Initialize User Preferences
        await pool.query('INSERT INTO user_preferences (user_id) VALUES (?)', [userId]);

        return successResponse(res, 'Registration successful. Please check your email to verify your account.', { userId: userId }, 201);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error during registration', 500);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const [users] = await pool.query('SELECT * FROM users WHERE verification_token = ?', [token]);

        if (users.length === 0) return errorResponse(res, 'Invalid or expired verification token', 400);

        await pool.query('UPDATE users SET email_verified = true, verification_token = NULL WHERE id = ?', [users[0].id]);

        return successResponse(res, 'Email verified successfully. You can now log in.');
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error during email verification', 500);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return errorResponse(res, 'Please provide email and password', 400);

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0 || !users[0].password_hash) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, users[0].password_hash);
        if (!isMatch) return errorResponse(res, 'Invalid credentials', 401);

        if (!users[0].email_verified) return errorResponse(res, 'Please verify your email before logging in', 403);

        const token = generateToken(users[0].id);

        return successResponse(res, 'Login successful', {
            token,
            user: {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email,
                university: users[0].university,
                department: users[0].department,
                year: users[0].year
            }
        });
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error during login', 500);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) return errorResponse(res, 'User not found', 404);

        const resetToken = generateVerificationToken();
        const resetExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await pool.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [resetToken, resetExpire, users[0].id]);

        await sendPasswordResetEmail(email, resetToken);

        return successResponse(res, 'Password reset link sent to your email');
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error during forgot password', 500);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const validatePassword = (pwd) => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pwd);
        if (!password || !validatePassword(password)) return errorResponse(res, 'Password must contain at least 8 characters, one uppercase, one number and one special character', 400);

        const [users] = await pool.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);

        if (users.length === 0) return errorResponse(res, 'Invalid or expired reset token', 400);

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await pool.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [passwordHash, users[0].id]);

        return successResponse(res, 'Password reset successfully');
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error during password reset', 500);
    }
};

const logout = (req, res) => {
    // With pure JWT architecture on frontend, logout happens client-side simply by deleting the token.
    // So this endpoint is just acknowledging the request.
    return successResponse(res, 'Logged out successfully');
};

module.exports = {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    logout
};
