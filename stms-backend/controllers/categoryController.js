const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const Joi = require('joi');

const createCategory = async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            type: Joi.string().valid('assignment', 'exam', 'project', 'personal').required()
        });
        const { error } = schema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { name, type } = req.body;
        const [result] = await pool.query('INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)', [req.user.id, name, type]);
        const [newCat] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

        return successResponse(res, 'Category created', newCat[0], 201);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error creating category', 500);
    }
};

const getCategories = async (req, res) => {
    try {
        let [categories] = await pool.query('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC', [req.user.id]);

        // If categories are empty, seed defaults (Self-healing mechanism)
        if (categories.length === 0) {
            const defaultCategories = [
                ['Assignment', 'assignment'],
                ['Exam', 'exam'],
                ['Project', 'project'],
                ['Personal', 'personal']
            ];

            try {
                for (const [catName, catType] of defaultCategories) {
                    await pool.query(
                        'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
                        [req.user.id, catName, catType]
                    );
                }
                // Fetch again after success
                [categories] = await pool.query('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC', [req.user.id]);
            } catch (seedErr) {
                console.error('Category seeding error:', seedErr);
                // Continue and return empty or whatever we have instead of 500ing purely on seed failure
            }
        }

        return successResponse(res, 'Categories fetched', categories);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error fetching categories', 500);
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type } = req.body;

        const [existing] = await pool.query('SELECT * FROM categories WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) return errorResponse(res, 'Category not found', 404);

        await pool.query('UPDATE categories SET name = COALESCE(?, name), type = COALESCE(?, type) WHERE id = ?', [name, type, id]);

        const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        return successResponse(res, 'Category updated', updated[0]);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error updating category', 500);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await pool.query('SELECT * FROM categories WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (existing.length === 0) return errorResponse(res, 'Category not found', 404);

        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return successResponse(res, 'Category deleted');
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Server error deleting category', 500);
    }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
