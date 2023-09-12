// custom middleware
const { checkAdmin, checkAdminCredentials } = require('../services/adminMiddleware');
// dependancies 
const studentConroller = require("../controllers/StudentController");
const express = require("express");
const upload = require('../services/imageMiddleware');

const router = express.Router();

// createStudent route
router.post('/signup', checkAdmin, studentConroller.createStudent);

// login 
router.post('/login', studentConroller.login);

// getCount 
router.get('/getcount/:_id', studentConroller.getCount);

// getGrade 
router.get('/getgrade/:_id', studentConroller.getGrade);

// get single student
router.get('/getstudent/:_id', studentConroller.getStudent);

// mark attendance
router.get('/markattendance/:_id', studentConroller.markAttendance);

// update profile picture
router.post('/updateprofile', upload.single('file'), studentConroller.updateProfile);

// Leave Request
router.post('/leaverequest', studentConroller.leaveRequest);

// export router
module.exports = router;