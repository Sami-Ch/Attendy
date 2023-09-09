const Student = require('../models/student.model');
const mongoose = require('mongoose');

//*--------------------------------------------------------------------------------------attendance statuses
const attendanceStatusCal = async (_id) => {
   const studentId = _id;

   try {
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

      const result = await Student.aggregate(pipeline).exec();
      if (result.length > 0) {
         return result[0];
      } else {
         return { present: 0, absent: 0, leave: 0 };
      }
   } catch (error) {
      console.error('Error:', error);
      throw error;
   }
}

//*--------------------------------------------------------------------------------------calculate grade
async function calculateGrade(studentId) {
   try {
      const attendanceStatuses = await attendanceStatusCal(studentId);

      const presentStatus = attendanceStatuses.presents;
      const presentPercentage = (presentStatus ? presentStatus.total : 0) / attendanceStatuses.totalAttendance * 100;

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
      console.log('====================================');
      console.log(attendanceStatuses);
      console.log('====================================');

      return grade;
   } catch (error) {
      console.error('Error:', error);
      throw error; // Propagate the error
   }
}

module.exports = {
   attendanceStatusCal,
   calculateGrade,
}