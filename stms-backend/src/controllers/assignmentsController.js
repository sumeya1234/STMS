const pool = require('../config/db');
const { distributeAssignment } = require('../services/taskDistributor');
const v = require('../services/inputValidator');

// CREATE Assignment (Teacher Only)
exports.createAssignment = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const { target_department, target_year, course_name, course_code, title, description, due_date, marks } = req.body;

        // --- INPUT VALIDATION ---
        if (!v.isNonEmpty(target_department))
            return res.status(400).json({ message: 'Target department is required.' });
        if (!v.isValidYear(target_year))
            return res.status(400).json({ message: 'Target year must be between 1 and 6.' });
        if (!v.isNonEmpty(course_name))
            return res.status(400).json({ message: 'Course name is required.' });
        if (!v.isNonEmpty(course_code))
            return res.status(400).json({ message: 'Course code is required.' });
        if (!v.isNonEmpty(title))
            return res.status(400).json({ message: 'Assignment title is required.' });
        if (!v.isFutureDate(due_date))
            return res.status(400).json({ message: 'Due date must be a valid future date.' });
        if (!v.isValidMarks(marks))
            return res.status(400).json({ message: 'Marks must be a number between 1 and 100.' });

        const file_path = req.file ? req.file.path : null;

        const [result] = await pool.execute(
            `INSERT INTO assignments (teacher_id, target_department, target_year, course_name, course_code, title, description, due_date, marks, file_path) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [teacher_id, target_department.toLowerCase().trim(), parseInt(target_year), course_name.trim(), course_code.trim().toUpperCase(), title.trim(), description?.trim() || null, due_date, parseFloat(marks), file_path]
        );

        const assignmentId = result.insertId;
        const distributionStats = await distributeAssignment(assignmentId, target_department.toLowerCase().trim(), parseInt(target_year));

        res.status(201).json({
            message: 'Assignment broadcasted successfully',
            assignment_id: assignmentId,
            audience_reached: distributionStats?.matched_students || 0
        });

    } catch (error) {
        console.error('Assignment Error:', error);
        res.status(500).json({ message: 'Server error creating assignment' });
    }
};

// GET Assignments Inbox (Student view based on department + year)
exports.getStudentInbox = async (req, res) => {
    try {
        const student_id = req.user.id;
        const student_dept = req.user.department;
        const student_year = req.user.study_year;

        const [inboxItems] = await pool.execute(
            `SELECT a.* FROM assignments a
             WHERE a.target_department = ? AND a.target_year = ?
             AND a.id NOT IN (
                SELECT assignment_id FROM student_tasks 
                WHERE student_id = ? AND assignment_id IS NOT NULL
             )
             ORDER BY a.due_date ASC`,
            [student_dept, student_year, student_id]
        );

        res.json({ inbox: inboxItems });
    } catch (error) {
        console.error('Inbox Error:', error);
        res.status(500).json({ message: 'Failed to fetch assignment inbox' });
    }
};

// PATCH /assignments/:id - Update Broadcast Details
exports.updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher_id = req.user.id;
        const { title, description, due_date, marks } = req.body;

        // Optionally, check if they exist
        const updates = [];
        const params = [];
        if (title) { updates.push('title = ?'); params.push(title); }
        if (description !== undefined) { updates.push('description = ?'); params.push(description); }
        if (due_date) { updates.push('due_date = ?'); params.push(due_date); }
        if (marks) { updates.push('marks = ?'); params.push(parseFloat(marks)); }

        if (updates.length === 0) return res.json({ message: 'Nothing to update' });

        params.push(id, teacher_id);

        const [result] = await pool.execute(
            `UPDATE assignments SET ${updates.join(', ')} WHERE id = ? AND teacher_id = ?`,
            params
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Assignment not found or unauthorized' });

        res.json({ message: 'Assignment updated successfully' });
    } catch (error) {
        console.error('Update Assignment Error:', error);
        res.status(500).json({ message: 'Failed to update assignment' });
    }
};
