const Student = require('../models/student.model');
const mongoose = require('mongoose');

//*--------------------------------------------------------------------------------------attendance statuses
const attendanceStatusCal = async (_id) => {
   const studentId = _id;

   try {
      // Fetch the student document once
      const student = await Student.findById(studentId);

      if (!student) {
         throw new Error('Student not found');
      }

      // Define the aggregation pipeline to sum attendance statuses
      const pipeline = [
         {
            $match: {
               _id: new mongoose.Types.ObjectId(studentId),
            },
         },
         {
            $unwind: '$attendance',
         },
         {
            $group: {
               _id: '$attendance.status',
               total: { $sum: 1 },
            },
         },
         {
            $group: {
               _id: null,
               totalAttendance: { $sum: '$total' },
               presents: {
                  $sum: {
                     $cond: [{ $eq: ['$_id', 'present'] }, '$total', 0],
                  },
               },
               absents: {
                  $sum: {
                     $cond: [{ $eq: ['$_id', 'absent'] }, '$total', 0],
                  },
               },
               leaves: {
                  $sum: {
                     $cond: [{ $eq: ['$_id', 'leave'] }, '$total', 0],
                  },
               },
            },
         },
      ];

      let result = await Student.aggregate(pipeline).exec();

      if (result.length > 0) {
         result[0].totalAttendance -= 0;
         const count = result[0];

         student.attendanceCount.presents = count.presents;
         student.attendanceCount.absents = count.absents;
         student.attendanceCount.leaves = count.leaves;

         // Use await when saving the student document
         await student.save();

         return count;
      } else {
         return { presents: 0, absents: 0, leaves: 0 };
      }
   } catch (error) {
      console.error('Error:', error);
      throw error;
   }
};

//*--------------------------------------------------------------------------------------calculate grade
const calculateGrade = async (studentId) => {
   try {
      const count = await attendanceStatusCal(studentId);
      const presentStatus = count.presents + count.leaves;
      const presentPercentage = (presentStatus ? presentStatus : 0) / count.totalAttendance * 100;

      // Determine the grade based on the percentage
      let grade;
      if (presentPercentage >= 87) {
         grade = 'A';
      } else if (presentPercentage >= 70) {
         grade = 'B';
      } else if (presentPercentage >= 53) {
         grade = 'C';
      } else if (presentPercentage >= 33) {
         grade = 'D';
      } else {
         grade = 'F';
      }

      const user = await Student.findById(studentId);

      if (!user) {
         throw new Error('User not found');
      }

      user.grade = grade;

      // Use await when saving the user document
      await user.save();

      return grade;
   } catch (error) {
      console.error('Error:', error);
      throw error; // Propagate the error
   }
};

module.exports = {
   attendanceStatusCal,
   calculateGrade,
};
