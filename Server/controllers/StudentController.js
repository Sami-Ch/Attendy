const Student = require("../models/student.model");

const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { error } = require("console");
const sharp = require("sharp");
const { attendanceStatusCal, calculateGrade } = require('../services/attendanceOperations');
const { sendLeaveRequestEmail } = require('../services/mailAdmin')

//* ---------------------------------------------------------create student 
const createStudent = async (req, res) => {
   try {
      const student = await Student.findOne({ email: req.body.email.toLowerCase() });

      const imageBinaryData = fs.readFileSync("./assets/profileReplacement.webP");         //  dummy profile replacement

      if (!student) {
         const password = req.body.password;
         const hash = await bcrypt.hash(password, 10);

         const newStudent = await Student.create({                                       // creating new student 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(),
            password: hash,
            sex: req.body.sex,
            profileImage: { imageData: imageBinaryData, __filename: `${req.body.firstName}'s profile` },
            attendance: { status: 'absent' },
         });

         return res.status(200).send({
            error: false,
            student: newStudent,
         });
      } else {
         return res.status(404).json({
            message: 'student already exists',
            error: true
         })
      }
   } catch (error) {
      console.error(error);
      return res.status(500).send({
         message: `Internal server error: ${error}`,
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
         firstName: student.firstName,
         lastName: student.lastName,
         email: student.email,
         sex: student.sex,
         profileImage: student.profileImage,
         grade: student.grade,
         attendance: student.attendance,
      };

      const token = jwt.sign(tokenPayload, process.env.SECRET_KEY);

      return res.status(200).json({ Status: "Logged IN", Token: token, error: false });
   } catch (error) {
      // console.error(error);
      return res.status(500).json({
         message: `Internal server error: ${error}`,
         error: true,
      });
   }
};

//* ------------------------------------------------------------get single student
const getStudent = async (req, res) => {
   try {
      const student = await Student.findOne({ email: req.body.email.toLowerCase() });

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
      };
      res.status(200).send({
         error: false,
         student: studentData
      })

   } catch (error) {
      return res.status(500).json({
         message: `Internal server error: ${error}`,
         error: true,
      });
   }
}

//* ------------------------------------------------------------get all students
const getStudents = async (req, res) => {
   try {
      // Define the aggregation pipeline
      const pipeline = [
         {
            $project: {
               firstName: 1,
               lastName: 1,
               email: 1,
               sex: 1,
               grade: 1,
               attendance: 1,
               profileImage: 1,
            }, $project: {
               _id: 0,
               password: 0,
            },
         },
      ];
      // Performing aggregation 
      Student.aggregate(pipeline)
         .then((students) => {
            // console.log(students);
            return res.status(200).json({
               students: students,
               error: false,
            });
         }).catch((error) => { throw new Error; });

   } catch (error) {
      return res.status(Error ? 404 : 500).json({
         message: Error ? error : `Internal server error: ${error}`,
         error: true,
      });
   }
}

//* ------------------------------------------------------------update student
const updateProfile = async (req, res) => {
   try {
      const inputBuffer = Buffer.from(req.body.imageData, 'base64');
      const outputBuffer = await sharp(inputBuffer).webp().toBuffer();
      const student = await Student.findOne({ email: req.body.email.toLowerCase() });

      student.profileImage.imageData = outputBuffer;
      student.profileImage.__filename = `${student.firstName}'s profile`;
      await student.save();

      return res.send({
         imageData: outputBuffer,
         error: false,
      });
   } catch (error) {
      console.error('Error:', error);
      res.status(500).send({
         message: 'Image conversion failed',
         error: true,
      });
   }
}

//* ------------------------------------------------------------mark student attendance
const markAttendance = async (req, res) => {
   try {

      const newAttendance = req.body.attendance;
      const currentDate = newAttendance.date ?
         new Date(newAttendance.date).toDateString() : new Date().toDateString();

      const filter = { email: req.body.email.toLowerCase() };
      const student = await Student.findOne(filter);

      const attendanceIndex = student.attendance.findIndex(
         (en) => new Date(en.date).toDateString() === currentDate
      );

      if (attendanceIndex !== -1) {
         student.attendance[attendanceIndex] = newAttendance;
         await student.save();
         return res.status(200).json({
            student: student,
            error: false,
         });
      } else {
         student.attendance.push(newAttendance);
         await student.save();
         return res.status(200).json({
            student: student.attendance,
            error: false,
         });
      }
   } catch (error) {
      return res.status(error ? 404 : 500).json({
         message: `Internal server error: ${error}`,
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
         message: `Internal server error: ${err}`,
         error: true,
      });
   }
}

// export controllers
module.exports = {
   createStudent,
   login,
   getStudent,
   getStudents,
   markAttendance,
   leaveRequest,
   updateProfile,

};


