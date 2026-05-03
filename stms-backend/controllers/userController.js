const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const Joi = require('joi');

const getMe = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, u.university, u.department, u.year, u.email_verified, u.created_at,
                   up.dark_mode, up.task_reminders, up.weekly_digest, up.auto_focus_mode
            FROM users u
            LEFT JOIN user_preferences up ON u.id = up.user_id
            WHERE u.id = ?
        `;
        const [users] = await pool.query(query, [req.user.id]);

        if (users.length === 0) return errorResponse(res, 'User not found', 404);

        return successResponse(res, 'User profile fetched', users[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching user profile', 500);
    }
};

const updateProfile = async (req, res) => {
    try {
        const allowedFields = ['name', 'university', 'department', 'year'];
        const setClauses = [];
        const params = [];
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                setClauses.push(`${field} = ?`);
                params.push(req.body[field] || null);
            }
        }
        if (setClauses.length === 0) return successResponse(res, 'Nothing to update');
        params.push(req.user.id);
        await pool.query(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`, params);
        const [updated] = await pool.query('SELECT id, name, email, university, department, year FROM users WHERE id = ?', [req.user.id]);
        return successResponse(res, 'Profile updated successfully', updated[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error updating profile', 500);
    }
};

const getPreferences = async (req, res) => {
    try {
        const [prefs] = await pool.query('SELECT * FROM user_preferences WHERE user_id = ?', [req.user.id]);

        if (prefs.length === 0) return errorResponse(res, 'Preferences not found', 404);

        return successResponse(res, 'Preferences fetched', prefs[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching preferences', 500);
    }
};

const updatePreferences = async (req, res) => {
    try {
        const schema = Joi.object({
            dark_mode: Joi.boolean(),
            task_reminders: Joi.boolean(),
            weekly_digest: Joi.boolean(),
            auto_focus_mode: Joi.boolean()
        });

        const { error } = schema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { dark_mode, task_reminders, weekly_digest, auto_focus_mode } = req.body;

        await pool.query(
            'UPDATE user_preferences SET dark_mode = COALESCE(?, dark_mode), task_reminders = COALESCE(?, task_reminders), weekly_digest = COALESCE(?, weekly_digest), auto_focus_mode = COALESCE(?, auto_focus_mode) WHERE user_id = ?',
            [dark_mode, task_reminders, weekly_digest, auto_focus_mode, req.user.id]
        );

        const [updated] = await pool.query('SELECT * FROM user_preferences WHERE user_id = ?', [req.user.id]);

        return successResponse(res, 'Preferences updated successfully', updated[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error updating preferences', 500);
    }
};

const deleteAccount = async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
        return successResponse(res, 'Account deleted successfully');
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error deleting account', 500);
    }
};

module.exports = {
    getMe,
    updateProfile,
    getPreferences,
    updatePreferences,
    deleteAccount
};
