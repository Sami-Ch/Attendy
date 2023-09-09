const { model } = require("mongoose");
const studentConroller = require("../controllers/StudentController");
const express = require("express");

const router = express.Router();

// createStudent route
router.post('/signup', studentConroller.createStudent);

// login 
router.post('/login', studentConroller.login);

// get single student
router.post('/getstudent', studentConroller.getStudent);

// get all users 
router.get('/getstudents', studentConroller.getStudents);

// mark attendance
router.put('/markAttendance', studentConroller.markAttendance);

// update profile picture
router.post('/updateprofile', studentConroller.updateProfile);

// Leave Request
router.post('/leaverequest', studentConroller.leaveRequest);

// export router
module.exports = router;