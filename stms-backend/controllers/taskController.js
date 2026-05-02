const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const Joi = require('joi');

const createTask = async (req, res) => {
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().allow('', null),
            subject: Joi.string().required(),
            deadline: Joi.date().iso().required(),
            priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
            category_id: Joi.number().integer().allow(null)
        });

        const { error } = schema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { title, description, subject, deadline, priority, category_id } = req.body;

        const dateObj = new Date(deadline);
        const year = dateObj.getFullYear();
        if (year < 2024 || year > 2100) {
            return errorResponse(res, 'Deadline must be between 2024 and 2100', 400);
        }

        const validPriorities = ['low', 'medium', 'high'];
        const taskPriority = validPriorities.includes(String(priority).toLowerCase())
            ? String(priority).toLowerCase()
            : 'medium';

        const mysqlDatetime = dateObj.toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, category_id, title, description, subject, deadline, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, category_id || null, title, description || null, subject, mysqlDatetime, taskPriority, 'pending']
        );

        const [newTask] = await pool.query(`
            SELECT t.*, c.name as category_name 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.id = ?
        `, [result.insertId]);

        return successResponse(res, 'Task created successfully', newTask[0], 201);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error creating task', 500);
    }
};

const getTasks = async (req, res) => {
    try {
        const { status, priority, subject, category_id, from, to, search, sortby = 'deadline', sortdir = 'ASC' } = req.query;

        let query = `
            SELECT t.*, c.name as category_name 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = ?
        `;
        let params = [req.user.id];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }
        if (subject) {
            query += ' AND subject = ?';
            params.push(subject);
        }
        if (category_id) {
            query += ' AND category_id = ?';
            params.push(category_id);
        }
        if (from) {
            query += ' AND deadline >= ?';
            params.push(new Date(from).toISOString().slice(0, 19).replace('T', ' '));
        }
        if (to) {
            query += ' AND deadline <= ?';
            params.push(new Date(to).toISOString().slice(0, 19).replace('T', ' '));
        }
        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const allowedSortCols = ['deadline', 'priority', 'created_at'];
        const sortCol = allowedSortCols.includes(sortby) ? sortby : 'deadline';

        // Custom priority sorting trick
        if (sortCol === 'priority') {
            const dir = sortdir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            query += ` ORDER BY FIELD(priority, 'low', 'medium', 'high') ${dir}`;
        } else {
            const dir = sortdir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            query += ` ORDER BY ${sortCol} ${dir}`;
        }

        const [tasks] = await pool.query(query, params);

        return successResponse(res, 'Tasks fetched successfully', tasks);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching tasks', 500);
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const [tasks] = await pool.query(`
            SELECT t.*, c.name as category_name 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.id = ? AND t.user_id = ?
        `, [id, req.user.id]);

        if (tasks.length === 0) return errorResponse(res, 'Task not found', 404);

        return successResponse(res, 'Task fetched', tasks[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching task', 500);
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const schema = Joi.object({
            title: Joi.string(),
            description: Joi.string().allow('', null),
            subject: Joi.string(),
            deadline: Joi.date().iso(),
            priority: Joi.string().valid('low', 'medium', 'high'),
            status: Joi.string().valid('pending', 'in_progress', 'completed'),
            category_id: Joi.number().integer().allow(null)
        });

        const { error } = schema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) return errorResponse(res, 'Task not found', 404);

        const updates = req.body;
        let queryParams = [];
        let setClauses = [];

        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                setClauses.push(`${key} = ?`);
                if (key === 'deadline') {
                    const dateObj = new Date(updates[key]);
                    queryParams.push(dateObj.toISOString().slice(0, 19).replace('T', ' '));
                } else {
                    queryParams.push(updates[key]);
                }
            }
        });

        if (setClauses.length > 0) {
            queryParams.push(id);
            await pool.query(`UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`, queryParams);
        }

        const [updated] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        return successResponse(res, 'Task updated successfully', updated[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error updating task', 500);
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'in_progress', 'completed'].includes(status)) {
            return errorResponse(res, 'Invalid status', 400);
        }

        const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) return errorResponse(res, 'Task not found', 404);

        await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);

        const [updated] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        return successResponse(res, 'Task status updated', updated[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error updating task status', 500);
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);

        if (existing.length === 0) return errorResponse(res, 'Task not found', 404);

        await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

        return successResponse(res, 'Task deleted successfully');
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error deleting task', 500);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask
};
