const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const pool = require('../config/db');

// Both roles need analytics, but they see different things
router.use(checkAuth);

// GET /api/analytics/teacher -> Teacher sees statuses of all assignments they broadcasted
router.get('/teacher', roleGuard(['Teacher']), async (req, res) => {
    try {
        const teacher_id = req.user.id;

        // Retrieve summaries of completion states per assignment
        const [stats] = await pool.execute(`
            SELECT a.id as assignment_id, a.title, a.target_department, a.target_year, a.due_date, a.description, a.marks, a.course_name, a.course_code,
                   COUNT(st.id) as total_accepted,
                   SUM(CASE WHEN st.status = 'Completed' THEN 1 ELSE 0 END) as completed,
                   SUM(CASE WHEN st.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
                   SUM(CASE WHEN st.status = 'Pending' THEN 1 ELSE 0 END) as pending
            FROM assignments a
            LEFT JOIN student_tasks st ON a.id = st.assignment_id
            WHERE a.teacher_id = ?
            GROUP BY a.id, a.title, a.target_department, a.target_year, a.due_date, a.description, a.marks, a.course_name, a.course_code
            ORDER BY a.due_date DESC
        `, [teacher_id]);

        res.json({ analytics: stats });
    } catch (error) {
        console.error('Teacher Analytics Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /api/analytics/student -> Student checks personal completion rate
router.get('/student', roleGuard(['Student']), async (req, res) => {
    try {
        const student_id = req.user.id;

        const [stats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_tasks,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
            FROM student_tasks
            WHERE student_id = ?
        `, [student_id]);

        res.json({ analytics: stats[0] });
    } catch (error) {
        console.error('Student Analytics Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
