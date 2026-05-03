const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const getDashStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Use a simple date object trick to get start and end of week (Sunday to Saturday)
        // Adjust depending on whether the week starts on Sunday or Monday in the locality
        const today = new Date();
        const dayOfWeek = today.getDay();
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - dayOfWeek);
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);

        const firstDayStr = firstDay.toISOString().slice(0, 19).replace('T', ' ');
        const lastDayStr = lastDay.toISOString().slice(0, 19).replace('T', ' ');

        // We want Total Tasks (total active right now or all time?), let's do all time total for this user
        const [totalTasksRes] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?', [userId]);

        // Completed Tasks (All time or this week? Let's assume all time for 'Done')
        const [doneTasksRes] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "completed"', [userId]);

        // Pending Tasks (To Do / In Progress)
        const [pendingTasksRes] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status != "completed"', [userId]);

        // Overdue Tasks
        const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [overdueTasksRes] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status != "completed" AND deadline < ?', [userId, nowStr]);

        return successResponse(res, 'Stats fetched', {
            total: totalTasksRes[0].count,
            done: doneTasksRes[0].count,
            pending: pendingTasksRes[0].count,
            overdue: overdueTasksRes[0].count
        });
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching dashboard stats', 500);
    }
};

const getDashOverdue = async (req, res) => {
    try {
        const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [tasks] = await pool.query('SELECT * FROM tasks WHERE user_id = ? AND status != "completed" AND deadline < ? ORDER BY deadline ASC', [req.user.id, nowStr]);

        return successResponse(res, 'Overdue tasks fetched', tasks);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching overdue tasks', 500);
    }
};

const getDashUpcoming = async (req, res) => {
    try {
        const now = new Date();
        const nowStr = now.toISOString().slice(0, 19).replace('T', ' ');
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().slice(0, 19).replace('T', ' ');

        const [tasks] = await pool.query(
            `SELECT t.*, c.name as category_name FROM tasks t LEFT JOIN categories c ON t.category_id = c.id 
             WHERE t.user_id = ? AND t.status != 'completed' AND t.deadline >= ? AND t.deadline <= ? ORDER BY t.deadline ASC`,
            [req.user.id, nowStr, nextWeekStr]
        );

        return successResponse(res, 'Upcoming tasks fetched', tasks);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching upcoming tasks', 500);
    }
};

module.exports = { getDashStats, getDashOverdue, getDashUpcoming };
