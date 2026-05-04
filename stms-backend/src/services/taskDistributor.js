const pool = require('../config/db');
const emailService = require('./emailService');

/**
 * TaskDistributor Service
 * Core logic executed immediately after a teacher uploads an assignment.
 * Target Department + Year. Finds matches, notifies them, triggers email.
 */
exports.distributeAssignment = async (assignmentId, targetDept, targetYear) => {
    try {
        const [students] = await pool.execute(
            'SELECT email, full_name FROM users WHERE role = ? AND department = ? AND study_year = ?',
            ['Student', targetDept.toLowerCase().trim(), targetYear]
        );

        console.log(`[Distribution Engine] Broadcasted Assignment ID: ${assignmentId} targets ${students.length} students in ${targetDept} (Year ${targetYear}).`);

        const [assignmentInfo] = await pool.execute('SELECT * FROM assignments WHERE id = ?', [assignmentId]);

        if (students.length > 0 && assignmentInfo.length > 0) {
            const emails = students.map(s => s.email);
            // Send email to all dynamically mapped students
            await emailService.sendAssignmentNotification(emails, assignmentInfo[0]);
        }

        return { matched_students: students.length };
    } catch (error) {
        console.error('[Distribution Engine] Error:', error);
    }
};
