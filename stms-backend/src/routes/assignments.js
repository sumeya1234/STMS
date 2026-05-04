const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const upload = require('../middleware/upload');
const assignmentsController = require('../controllers/assignmentsController');

// TEACHER ROUTES
// POST /api/assignments (Upload new broadcast assignment)
router.post('/',
    checkAuth,
    roleGuard(['Teacher']),
    upload.single('file'),
    assignmentsController.createAssignment
);

// PATCH /api/assignments/:id (Edit existing broadcast assignment)
router.patch('/:id',
    checkAuth,
    roleGuard(['Teacher']),
    assignmentsController.updateAssignment
);

// STUDENT ROUTES
// GET /api/assignments/inbox (Fetch suggested assignments matching department/year)
router.get('/inbox',
    checkAuth,
    roleGuard(['Student']),
    assignmentsController.getStudentInbox
);

module.exports = router;
