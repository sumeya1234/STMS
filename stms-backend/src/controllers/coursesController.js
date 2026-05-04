const pool = require('../config/db');

exports.getCourses = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const [courses] = await pool.execute('SELECT * FROM teacher_courses WHERE teacher_id = ? ORDER BY created_at DESC', [teacher_id]);
        res.json({ courses });
    } catch (error) {
        console.error('Fetch Courses Error:', error);
        res.status(500).json({ message: 'Server internal error' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const { course_name, course_code, target_department, target_year } = req.body;

        if (!course_name || !course_code || !target_department || !target_year) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO teacher_courses (teacher_id, course_name, course_code, target_department, target_year) VALUES (?, ?, ?, ?, ?)',
            [teacher_id, course_name, course_code, target_department, target_year]
        );

        res.status(201).json({ message: 'Course profile added', id: result.insertId });
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ message: 'Server internal error' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher_id = req.user.id;

        const [result] = await pool.execute('DELETE FROM teacher_courses WHERE id = ? AND teacher_id = ?', [id, teacher_id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found or unauthorized' });

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Delete Course Error:', error);
        res.status(500).json({ message: 'Server internal error' });
    }
};
