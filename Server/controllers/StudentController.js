const Student = require("../models/student.model");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { error } = require("console");
const sharp = require("sharp");
const { attendanceStatusCal, calculateGrade } = require('../services/attendanceOperations');
const { sendLeaveRequestEmail } = require('../services/mailAdmin');

//* ---------------------------------------------------------create student 
const createStudent = async (req, res) => {
   try {
      const student = await Student.findOne({ email: req.body.email.toLowerCase() });

      const imagePath = "./assets/profileReplacement.webP";         //  dummy profile replacement

      if (!student) {
         const password = req.body.password;
         const hash = await bcrypt.hash(password, 10);

         const newStudent = await Student.create({                                       // creating new student 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(),
            password: hash,
            sex: req.body.sex,
            profileImage: { imageUrl: imagePath, __filename: 'defaultImage' }
         });

         return res.status(200).send({
            error: false,
            student: newStudent._id,
         });
      } else {
         return res.status(404).json({
            message: 'Email already exists',
            error: false
         })
      }
   } catch (error) {
      console.error(error);
      return res.status(500).send({
         message: `@createstudent: ${error}`,
         error: true,
      });
   }
};

//* ------------------------------------------------------------login student
const login = async (req, res) => {
   try {
      const student = await Student.findOne({ email: req.body.email.toLowerCase() });

      if (!student) {
         return res.status(404).json({
            message: 'student not found',
            error: true
         })
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, student.password);

      if (!isPasswordValid) {
         return res.status(404).json({
            message: 'Invalid cradentials',
            error: true
         })
      }

      const tokenPayload = {
         _id: student._id,
         password: student.password,
         firstName: student.firstName,
         lastName: student.lastName,
         email: student.email,
         sex: student.sex,
         profileImage: student.profileImage,
         grade: student.grade,
         attendance: student.attendance,
         role: student.role,
      };

      const token = jwt.sign(tokenPayload, process.env.SECRET_KEY);

      return res.status(200).json({
         role: student.role, token: token, error: false
      });
   } catch (error) {
      // console.error(error);
      return res.status(500).json({
         message: `@Login: ${error}`,
         error: true,
      });
   }
};

//* ------------------------------------------------------------get single student
const getStudent = async (req, res) => {
   try {
      const student = await Student.findById(req.body._id);

      if (!student) {
         return res.status(404).json({
            message: 'student not found',
            error: true
         });
      };  // credential checks

      const studentData = {
         firstName: student.firstName,
         lastName: student.lastName,
         email: student.email,
         sex: student.sex,
         profileImage: student.profileImage,
         grade: student.grade,
         attendance: student.attendance,
         role: student.role,
      };
      res.status(200).send({
         error: false,
         student: studentData
      })

   } catch (error) {
      return res.status(500).json({
         message: `@getStudent: ${error}`,
         error: true,
      });
   }
}

//* ------------------------------------------------------------update student profile image
const updateProfile = async (req, res) => {
   try {
      //check file
      if (!req.file) {
         return res.status(400).json({
            message: 'No file uploaded.',
            error: true
         });
      }
      // create and save file to student
      const student = await Student.findById(req.body._id);
      if (!student) {
         return res.status(404).json({
            message: 'Student not found.',
            error: true
         });
      }
      const file = {
         __filename: `${student.firstName} profile`,
         imageUrl: req.file.path
      };
      student.profileImage = file;
      await student.save();

      res.status(200).json({
         imageUrl: student.profileImage.imagePath,
         message: 'Profile updated successfully.',
         error: false
      });

   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
         message: `@updateProfile: ${error.message}`, // Use error.message to capture the error message
         error: true
      });
   }
};

//* ------------------------------------------------------------mark student attendance
const markAttendance = async (req, res) => {
   try {
      const newAttendance = {
         status: 'present'
      }

      const filter = { email: req.body.email.toLowerCase() };
      const student = await Student.findOne(filter);
      const attendanceToday = student.attendance.find(
         (entry) =>
            new Date(entry.date).toDateString() === new Date().toDateString()
      );
      if (!attendanceToday) {
         student.attendance.push(newAttendance);
         await student.save();
      }
      return res.status(200).json({
         student: student.attendance,
         error: false,
      });

   } catch (error) {
      return res.status(500).json({
         message: `@markAttendance: ${error}`,
         error: true,
      });
   }
};

//* --------------------------------------------------------------------------request leave
const leaveRequest = async (req, res) => {
   try {
      const { email, leaveRequest } = req.body;
      const filter = { email: email.toLowerCase() };
      const student = await Student.findOne(filter);

      if (!student) {
         return res.status(404).json({
            message: 'Student not found',
            error: true
         });
      }

      const currentDate = new Date().toDateString();

      // Get attendance count using the attendanceStatusCal function
      const attendanceCount = await attendanceStatusCal(student._id);

      const newAttendance = {
         leaveRequest: leaveRequest,
         count: {
            presents: attendanceCount.presents,
            absents: attendanceCount.absents,
            leaves: attendanceCount.leaves,
            total: attendanceCount.totalAttendance,
         }
      }

      const attendanceIndex = student.attendance.findIndex(
         (en) => new Date(en.date).toDateString() === currentDate
      );

      if (attendanceIndex !== -1) {
         student.attendance[attendanceIndex] = newAttendance;
      } else {
         student.attendance.push(newAttendance);
      }

      await student.save();

      // Send mail to admin
      await sendLeaveRequestEmail(student, attendanceCount)

      return res.status(200).json({
         message: "Leave Request generated",
         student: student.attendance,
         error: false
      });
   } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
         message: `@LeaveRequest: ${err}`,
         error: true,
      });
   }
}

// export controllers
module.exports = {
   createStudent,
   login,
   getStudent,
   markAttendance,
   leaveRequest,
   updateProfile,

};