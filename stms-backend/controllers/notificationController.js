const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const getNotifications = async (req, res) => {
    try {
        const [notifications] = await pool.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC',
            [req.user.id]
        );
        return successResponse(res, 'Notifications fetched', notifications);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching notifications', 500);
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT * FROM notifications WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) return errorResponse(res, 'Notification not found', 404);

        await pool.query('UPDATE notifications SET is_read = true WHERE id = ?', [id]);

        const [updated] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);
        return successResponse(res, 'Notification marked as read', updated[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error updating notification', 500);
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT * FROM notifications WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) return errorResponse(res, 'Notification not found', 404);

        await pool.query('DELETE FROM notifications WHERE id = ?', [id]);
        return successResponse(res, 'Notification deleted');
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error deleting notification', 500);
    }
};

module.exports = { getNotifications, markAsRead, deleteNotification };
