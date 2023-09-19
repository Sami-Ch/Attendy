
const Student = require("../models/student.model");
const { attendanceStatusCal, calculateGrade } = require('../services/attendanceOperations');

const getAllStudents = async (req, res) => {
   try {
      const pipeline = [
         {
            $match: {
               role: { $ne: "admin" } // Exclude students with the "admin" role
            }
         },
         {
            $project: {
               firstName: 1,
               lastName: 1,
               email: 1,
               sex: 1,
               grade: 1,
               attendance: 1,
               role: 1,
               _id: 1,
               attendanceCount: 1,
            }
         },
         {
            $project: {
               profileImage: 0,
               password: 0,
            }
         }
      ];

      const students = await Student.aggregate(pipeline);

      for (const student of students) {
         const count = await attendanceStatusCal(student._id);
         const grade = await calculateGrade(student._id);
      }

      return res.status(200).json({
         students: students,
         error: false,
      });
   } catch (error) {
      return res.status(500).json({
         message: `Internal server error: ${error}`,
         error: true,
      });
   }
}

const editAttendance = async (req, res) => {
   try {
      const currentDate = req.body.attendance.date ? req.body.attendance.date : new Date();
      const newAttendance = {
         status: req.body.attendance.status,
         date: currentDate,
      };

      const student = await Student.findById(req.body._id);

      const attendanceIndex = student.attendance.findIndex(
         (en) => new Date(en.date).toDateString() === new Date(currentDate).toDateString()
      );

      if (attendanceIndex !== -1) {
         student.attendance[attendanceIndex] = newAttendance;
      } else {
         student.attendance.push(newAttendance);
      }

      await student.save();

      return res.status(200).json({
         student: student.attendance,
         error: false,
      });
   } catch (error) {
      return res.status(500).json({
         message: `@editAttendance: ${error}`,
         error: true,
      });
   }
};

async function getStudentDataByDate(req, res) {
   try {
      const fromDate = new Date(req.query.fromDate);
      const toDate = new Date(req.query.toDate);
      // const fromDate = new Date(req.body.fromDate);
      // const toDate = new Date(req.body.toDate);
      const result = await Student.aggregate([
         {
            $unwind: "$attendance",
         },
         {
            $addFields: {
               year: { $year: "$attendance.date" },
               month: { $month: "$attendance.date" },
               day: { $dayOfMonth: "$attendance.date" },
            },
         },
         {
            $match: {
               year: { $gte: fromDate.getFullYear(), $lte: toDate.getFullYear() },
               month: { $gte: fromDate.getMonth() + 1, $lte: toDate.getMonth() + 1 },
               day: { $gte: fromDate.getDate(), $lte: toDate.getDate() },
            },
         },
         {
            $group: {
               _id: null,
               students: {
                  $push: {
                     _id: "$attendance._id",
                     firstName: "$firstName",
                     lastName: "$lastName",
                     email: "$email",
                     sex: "$sex",
                     status: "$attendance.status",
                     grade: "$grade",
                     date: "$attendance.date"
                  },
               },
            },
         },
         {
            $project: {
               _id: 0,
               students: 1,
            },
         },
      ]);


      const allStudents = result[0]?.students || [];





      res.status(200).json(allStudents);
   } catch (error) {
      console.error("Error fetching student data by date:", error);
      res.status(500).json({ error: true, message: "Internal server error" });
   }
}


const deleteAttendance = async (req, res) => {
   try {
      const requireDate = new Date(req.body.attendance.date).toDateString();

      const student = await Student.findById(req.body._id);

      if (student) {
         const attendanceIndex = student.attendance.findIndex(
            (en) => new Date(en.date).toDateString() === requireDate
         );

         if (attendanceIndex !== -1) {
            student.attendance.splice(attendanceIndex, 1);
            await student.save();
         }

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
   getStudentDataByDate,
};
