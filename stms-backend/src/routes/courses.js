const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const coursesController = require('../controllers/coursesController');

router.use(checkAuth, roleGuard(['Teacher']));

router.get('/', coursesController.getCourses);
router.post('/', coursesController.createCourse);
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
