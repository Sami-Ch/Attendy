const adminController = require("../controllers/AdminController");
const express = require("express");
const { checkAdminCredentials } = require("../services/adminMiddleware");

const router = express.Router();

// get all users 
router.get('/getallstudents', checkAdminCredentials, adminController.getAllStudents);

// edit or add attendance
router.put('/editattandance', checkAdminCredentials, adminController.editAttendance)

// edit or delete attendance
router.delete('/deleteattandance', checkAdminCredentials, adminController.deleteAttendance)

module.exports = router;