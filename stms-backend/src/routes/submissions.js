const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const upload = require('../middleware/upload');
const submissionsController = require('../controllers/submissionsController');

router.use(checkAuth);

// Student Submit Work
router.post('/',
    roleGuard(['Student']),
    upload.single('file'),
    submissionsController.submitWork
);

// Student view their submissions
router.get('/my',
    roleGuard(['Student']),
    submissionsController.getStudentSubmissions
);

// Teacher view submissions for an assignment
router.get('/assignment/:assignmentId',
    roleGuard(['Teacher']),
    submissionsController.getTeacherSubmissions
);

// Teacher grade a submission
router.patch('/:id/grade',
    roleGuard(['Teacher']),
    submissionsController.gradeSubmission
);

module.exports = router;
