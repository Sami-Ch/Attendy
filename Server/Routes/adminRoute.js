const adminController = require("../controllers/AdminController");
const express = require("express");
const { checkAdminCredentials } = require("../services/adminMiddleware");

const router = express.Router();

// get all users 
router.get('/getallstudents', adminController.getAllStudents);

// edit or add attendance
router.post('/editattandance', checkAdminCredentials, adminController.editAttendance)

// edit or delete attendance
router.delete('/deleteattandance', checkAdminCredentials, adminController.deleteAttendance)

// agregated students based on date
router.get('/getstudentsbydate', checkAdminCredentials, adminController.getStudentDataByDate)

module.exports = router;