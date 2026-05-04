const pool = require('../config/db');

// Submit Work (Student Only)
exports.submitWork = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { assignment_id } = req.body;
        const file_path = req.file ? req.file.path : null;

        if (!assignment_id) return res.status(400).json({ message: 'Assignment ID is required' });
        if (!file_path) return res.status(400).json({ message: 'No file uploaded' });

        // Check if student already submitted
        const [existing] = await pool.execute('SELECT id FROM submissions WHERE assignment_id = ? AND student_id = ?', [assignment_id, student_id]);
        if (existing.length > 0) {
            // Update instead of creating new? Or error? Standard practice is allowing re-submission.
            await pool.execute(
                'UPDATE submissions SET file_path = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?',
                [file_path, existing[0].id]
            );
            return res.json({ message: 'Assignment re-submitted successfully' });
        }

        await pool.execute(
            'INSERT INTO submissions (assignment_id, student_id, file_path) VALUES (?, ?, ?)',
            [assignment_id, student_id, file_path]
        );

        res.status(201).json({ message: 'Assignment submitted successfully' });
    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ message: 'Server error during submission' });
    }
};

// Get My Submissions (Student)
exports.getStudentSubmissions = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [submissions] = await pool.execute(
            `SELECT s.*, a.title as assignment_title, a.course_name 
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             WHERE s.student_id = ? 
             ORDER BY s.submitted_at DESC`,
            [student_id]
        );
        res.json({ submissions });
    } catch (error) {
        console.error('Fetch Submissions Error:', error);
        res.status(500).json({ message: 'Failed to fetch submissions' });
    }
};

// Get Submissions for an Assignment (Teacher)
exports.getTeacherSubmissions = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const { assignmentId } = req.params;

        // Verify assignment belongs to teacher
        const [assignment] = await pool.execute('SELECT id FROM assignments WHERE id = ? AND teacher_id = ?', [assignmentId, teacher_id]);
        if (assignment.length === 0) return res.status(404).json({ message: 'Assignment not found or unauthorized' });

        const [submissions] = await pool.execute(
            `SELECT s.*, u.full_name as student_name, u.email as student_email 
             FROM submissions s
             JOIN users u ON s.student_id = u.id
             WHERE s.assignment_id = ?
             ORDER BY s.submitted_at DESC`,
            [assignmentId]
        );

        res.json({ submissions });
    } catch (error) {
        console.error('Fetch Teacher Submissions Error:', error);
        res.status(500).json({ message: 'Failed to fetch student submissions' });
    }
};

// Grade Submission (Teacher)
exports.gradeSubmission = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const { id } = req.params;
        const { grade, feedback } = req.body;

        // Verify it exists and belongs to this teacher's assignment
        const [subInfo] = await pool.execute(
            `SELECT s.id FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             WHERE s.id = ? AND a.teacher_id = ?`,
            [id, teacher_id]
        );

        if (subInfo.length === 0) return res.status(404).json({ message: 'Submission not found or unauthorized' });

        await pool.execute(
            'UPDATE submissions SET grade = ?, feedback = ?, status = "Graded" WHERE id = ?',
            [grade, feedback, id]
        );

        res.json({ message: 'Submission graded successfully' });
    } catch (error) {
        console.error('Grading Error:', error);
        res.status(500).json({ message: 'Failed to grade submission' });
    }
};
