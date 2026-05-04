const pool = require('../config/db');

// POST /tasks - Accept broadcast assignment or create personal
exports.createTask = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { is_personal, assignment_id, title, description, course_info, due_date, priority } = req.body;

        if (is_personal) {
            // It's a DIY Student Task
            if (!title || !due_date) return res.status(400).json({ message: 'Title and due date are required for personal tasks.' });

            const [result] = await pool.execute(
                `INSERT INTO student_tasks (student_id, assignment_id, title, description, course_info, due_date, priority, is_personal, status) 
                 VALUES (?, NULL, ?, ?, ?, ?, ?, 1, 'Pending')`,
                [student_id, title, description, course_info, due_date, priority || 'Medium']
            );
            return res.status(201).json({ message: 'Personal task created', id: result.insertId });

        } else {
            // It's an accepted Broadcast Assignment
            if (!assignment_id) return res.status(400).json({ message: 'assignment_id is required to accept an assignment.' });

            // Fetch the assignment details to copy them down
            const [assignments] = await pool.execute('SELECT * FROM assignments WHERE id = ?', [assignment_id]);
            if (assignments.length === 0) return res.status(404).json({ message: 'Assignment not found.' });

            const a = assignments[0];

            const [result] = await pool.execute(
                `INSERT INTO student_tasks (student_id, assignment_id, title, description, course_info, due_date, priority, is_personal, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'Pending')`,
                [student_id, assignment_id, a.title, a.description, a.course_name, a.due_date, priority || 'Medium']
            );
            return res.status(201).json({ message: 'Assignment accepted and added to tasks', id: result.insertId });
        }

    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ message: 'Server internal error' });
    }
};

// GET /tasks - Fetch user's tasks sorted by Urgency Algorithm (Priority Queue structure logic)
exports.getTasks = async (req, res) => {
    try {
        const student_id = req.user.id;

        const [tasks] = await pool.execute(`
            SELECT t.*, a.marks 
            FROM student_tasks t
            LEFT JOIN assignments a ON t.assignment_id = a.id
            WHERE t.student_id = ?
        `, [student_id]);

        // ALGORITHM: Calculate Urgency Score
        const MAX_DAYS_IN_SEMESTER = 120;
        const NOW = new Date();

        const sortedTasks = tasks.map(task => {
            const dueDate = new Date(task.due_date);
            const daysRemaining = (dueDate - NOW) / (1000 * 60 * 60 * 24);

            let deadline_urgency = 1 - (daysRemaining / MAX_DAYS_IN_SEMESTER);
            if (daysRemaining <= 0) deadline_urgency = 1.0; // Overdue is max urgency

            // Marks from assignment, defaults to 0 for personal tasks
            const grade_weight = (task.marks || 0) / 100;

            // Urgency Formula
            const score = (deadline_urgency * 0.6) + (grade_weight * 0.4);

            return { ...task, urgency_score: score, days_remaining: Math.floor(daysRemaining) };
        }).sort((a, b) => b.urgency_score - a.urgency_score); // High score floats to top

        res.json({ tasks: sortedTasks });
    } catch (error) {
        console.error('Fetch Tasks Error:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

// PATCH /tasks/:id - Update Task Status/Priority
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const student_id = req.user.id;
        const { status, priority, title, description, course_info, due_date } = req.body;

        const [result] = await pool.execute(
            `UPDATE student_tasks 
             SET status = COALESCE(?, status), 
                 priority = COALESCE(?, priority),
                 title = COALESCE(?, title),
                 description = COALESCE(?, description),
                 course_info = COALESCE(?, course_info),
                 due_date = COALESCE(?, due_date)
             WHERE id = ? AND student_id = ?`,
            [status || null, priority || null, title || null, description || null, course_info || null, due_date || null, id, student_id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found or unauthorized' });

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({ message: 'Server internal error' });
    }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const student_id = req.user.id;

        const [result] = await pool.execute('DELETE FROM student_tasks WHERE id = ? AND student_id = ?', [id, student_id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found or unauthorized' });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server internal error' });
    }
};
