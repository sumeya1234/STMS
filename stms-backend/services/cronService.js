const cron = require('node-cron');
const pool = require('../config/db');
const { sendEmail } = require('./emailService');

const initCronJobs = () => {
    // Run every day at 8:00 AM server time
    cron.schedule('0 8 * * *', async () => {
        console.log('[Cron] Running daily deadline reminders task...');
        try {
            // Find tasks due within the next 24 hours (and are still pending/in_progress)
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);

            const nowStr = now.toISOString().slice(0, 19).replace('T', ' ');
            const tomorrowStr = tomorrow.toISOString().slice(0, 19).replace('T', ' ');

            const [upcomingTasks] = await pool.query(`
                SELECT t.*, u.email, u.name, p.task_reminders 
                FROM tasks t
                JOIN users u ON t.user_id = u.id
                JOIN user_preferences p ON t.user_id = p.user_id
                WHERE t.status != 'completed' 
                AND t.deadline >= ? 
                AND t.deadline <= ?
            `, [nowStr, tomorrowStr]);

            for (const task of upcomingTasks) {
                // 1. Create In-App Notification
                await pool.query(
                    'INSERT INTO notifications (user_id, task_id, type, message) VALUES (?, ?, ?, ?)',
                    [task.user_id, task.id, 'deadline_reminder', `Your task "${task.title}" is due soon.`]
                );

                // 2. Send Email if the user has opted in to task_reminders
                if (task.task_reminders) {
                    const html = `
                        <h3>Deadline Reminder</h3>
                        <p>Hi ${task.name},</p>
                        <p>This is a reminder that your task <strong>"${task.title}"</strong> for <strong>${task.subject}</strong> is due on ${new Date(task.deadline).toLocaleString()}.</p>
                        <p>Log in to ScholarFlow to view more details.</p>
                    `;
                    await sendEmail({ email: task.email, subject: `Reminder: ${task.title} is due soon!`, html });
                }
            }

            console.log(`[Cron] Processed ${upcomingTasks.length} upcoming task reminders.`);
        } catch (error) {
            console.error('[Cron Error] Failed to run daily reminders:', error);
        }
    });
};

module.exports = { initCronJobs };
