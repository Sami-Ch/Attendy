const Student = require("../models/student.model");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { error, profile } = require("console");
const sharp = require("sharp");
const path = require('path');
const sizeOf = require('image-size');

const { attendanceStatusCal, calculateGrade } = require('../services/attendanceOperations');
const { sendLeaveRequestEmail } = require('../services/mailAdmin');

//* ---------------------------------------------------------create student 
const createStudent = async (req, res) => {
   try {
      const student = await Student.findOne({ email: req.body.email.toLowerCase() });

      const imagePath = "./uploads/profileReplacement.webP";         //  dummy profile replacement

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

//* ------------------------------------------------------------get count
const getCount = async (req, res) => {
   try {
      const student = Student.findById(req.params._id);
      if (student) {
         const attendanceCount = await attendanceStatusCal(req.params._id)
         res.status(200).json({
            presents: attendanceCount.presents,
            absents: attendanceCount.absents,
            leaves: attendanceCount.leaves,
            total: attendanceCount.totalAttendance,
            error: false
         })
      }
   } catch (error) {
      return res.status(500).json({
         message: `@getCount: ${error}`,
         error: true,
      });
   }
}

//* ------------------------------------------------------------get grade
const getGrade = async (req, res) => {
   try {
      const student = Student.findById(req.params._id);
      if (student) {
         const grade = await calculateGrade(req.params._id)

         res.status(200).json({
            grade: grade,
            error: false
         })
      }
   } catch (error) {
      return res.status(500).json({
         message: `@getCount: ${error}`,
         error: true,
      });
   }
}

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
         role: student.role, token: token, error: false, _id: student._id
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
      const student = await Student.findById(req.params._id);

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
      // Check file
      if (!req.file) {
         return res.status(400).json({
            message: 'No file uploaded.',
            error: true
         });
      }

      // Create and save file to student
      const student = await Student.findById(req.body._id);
      if (!student) {
         return res.status(404).json({
            message: 'Student not found.',
            error: true
         });
      }

      // Construct the absolute path by moving up one directory level
      const absoluteImagePath = path.join(__dirname, '..', req.file.path);
      const dimensions = sizeOf(absoluteImagePath);
      let imageFormat = dimensions.type;

      const filenameWithoutExtension = path.basename(absoluteImagePath, path.extname(absoluteImagePath));

      let compressedImageBuffer;

      if (imageFormat.toLowerCase() === 'jpeg' || imageFormat.toLowerCase() === 'jpg') {
         imageFormat = 'jpeg'
         compressedImageBuffer = await sharp(absoluteImagePath)
            .resize({ width: 800 })
            .rotate()
            .jpeg({ quality: 50 })
            .toBuffer();
      } else if (imageFormat.toLowerCase() === 'png') {
         compressedImageBuffer = await sharp(absoluteImagePath)
            .resize({ width: 800 })
            .rotate()
            .png({ quality: 80 })
            .toBuffer();
      } else if (imageFormattoLowerCase() === 'gif') {
         compressedImageBuffer = await sharp(absoluteImagePath)
            .resize({ width: 800 })
            .rotate()
            .gif({ quality: 80 })
            .toBuffer();
      } else if (imageFormat.toLowerCase() === 'webp') {

         compressedImageBuffer = await sharp(absoluteImagePath)
            .resize({ width: 800 })
            .rotate()
            .webp({ quality: 50 })
            .toBuffer();
      } else {

         // Handle other formats here or provide an error message
         return res.status(400).json({
            message: 'Unsupported image format.',
            error: true
         });
      }

      const mainImagePath = './uploads/profileReplacement.webP';
      const studentImagePath = `uploads/${student._id}.${imageFormat}`;

      if (!(req.file.path === mainImagePath)) {

         fs.unlink(req.file.path, (err) => {
            if (err) {
               console.error('Error deleting main image file:', err);
            }
         });
      }

      if (student.profileImage.imageUrl !== mainImagePath) {
         if (student.profileImage.imageUrl !== studentImagePath) {
            fs.unlink(student.profileImage.imageUrl, (err) => {
               if (err) {
                  console.error('Error deleting student image file:', err);
               }
            });
         }
      }
      // Save the compressed image with the same filename and extension
      const compressedImagePath = `${path.dirname(absoluteImagePath)}/${student._id}.${imageFormat}`;
      fs.writeFileSync(compressedImagePath, compressedImageBuffer);

      // Update the student's profile image with the compressed image path
      student.profileImage = {
         __filename: `${student.firstName} profile`,
         imageUrl: `uploads/${student._id}.${imageFormat}`
      };

      await student.save();

      res.status(200).json({
         imageUrl: student.profileImage.imageUrl,
         message: 'Profile updated successfully.',
         error: false
      });

   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
         message: `@updateProfile: ${error.message}`,
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

      const student = await Student.findById(req.params._id);
      const attendanceIndex = student.attendance.findIndex(
         (en) =>
            new Date(en.date).toDateString() === new Date().toDateString()
      );
      if (!student.attendance[attendanceIndex]) {
         student.attendance.push(newAttendance);
         await student.save();
      } else if (!student.attendance[attendanceIndex].status) {
         student.attendance[attendanceIndex] = newAttendance;
         await student.save();
      }
      return res.status(200).json({
         student: student.attendance,
         error: false,
      });

   } catch (error) {
      //console.log(error);
      return res.status(500).json({
         message: `@markAttendance: ${error}`,
         error: true,
      });
   }
};

//* --------------------------------------------------------------------------request leave
const leaveRequest = async (req, res) => {
   try {
      const { _id, leaveRequest } = req.body;

      const student = await Student.findById(_id);

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
      }
      const count = {
         presents: attendanceCount.presents,
         absents: attendanceCount.absents,
         leaves: attendanceCount.leaves,
         total: attendanceCount.totalAttendance,
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
      // //console.log(student);
      // Send mail to admin
      await sendLeaveRequestEmail(student, attendanceCount, leaveRequest)

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
   getCount,
   getGrade,

};