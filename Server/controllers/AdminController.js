const Student = require("../models/student.model");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const jwt = require("jsonwebtoken");

const { attendanceStatusCal, calculateGrade } = require('../services/attendanceOperations');


//* ------------------------------------------------------------get all students
const getAllStudents = async (req, res) => {
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
               role: 1,
               _id: 1,
            }, $project: {
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
         }).catch((error) => { throw error; });

   } catch (error) {
      return res.status(500).json({
         message: `Internal server error: ${error}`,
         error: true,
      });
   }
}

//* ------------------------------------------------------------edit & add attendance 
const editAttendance = async (req, res) => {
   try {
      // Parse the input date into a JavaScript Date object
      const currentDate = req.body.attendance.date
         ? req.body.attendance.date
         : new Date();
      const newAttendance = {
         status: req.body.attendance.status,
         date: currentDate,
      };

      const student = await Student.findById(req.body._id);

      const attendanceIndex = student.attendance.findIndex(
         (en) =>
            new Date(en.date).toDateString() === new Date(currentDate).toDateString()
      );

      console.log(newAttendance);
      if (attendanceIndex !== -1) {
         student.attendance[attendanceIndex] = newAttendance;
         await student.save();
         return res.status(200).json({
            student: student.attendance,
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
      return res.status(500).json({
         message: `@editAttendance: ${error}`,
         error: true,
      });
   }
};

//* ------------------------------------------------------------delete attendance 
const deleteAttendance = async (req, res) => {
   try {
      const requireDate = new Date(req.body.attendance.date).toDateString();

      const student = await Student.findById(req.body._id);
      if (student) {
         const attendanceIndex = student.attendance.findIndex(
            (en) => new Date(en.date).toDateString() === requireDate
         );
         student.attendance.splice(attendanceIndex, 1);
         await student.save();
         return res.status(200).json({
            student: student.attendance,
            error: false,
         });
      }
   } catch (error) {
      return res.status(500).json({
         message: `@deleteAttendance Internal server error: ${error}`,
         error: true,
      });
   }
}



module.exports = {
   getAllStudents,
   deleteAttendance,
   editAttendance,

}