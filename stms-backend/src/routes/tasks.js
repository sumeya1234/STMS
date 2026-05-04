const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const tasksController = require('../controllers/tasksController');

// All task routes require a student
router.use(checkAuth, roleGuard(['Student']));

router.post('/', tasksController.createTask);
router.get('/', tasksController.getTasks);
router.patch('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
