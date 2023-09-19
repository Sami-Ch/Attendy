const Student = require('../models/student.model');
const cron = require('cron').CronJob;
const moment = require('moment'); // For date manipulation

// Function to update attendance for a single student
async function updateStudentAttendance(student) {
   if (student.role === 'student') {
      const yesterday = moment().subtract(1, 'days').startOf('day').toDate();
      const attendanceToday = student.attendance.find(
         (entry) => moment(entry.date).isSame(yesterday, 'day')
      );

      if (!attendanceToday) {
         // If attendance for today does not exist, add a new entry with "absent" status
         student.attendance.push({
            date: yesterday,
            status: 'absent',
         });
         await student.save();
         //console.log(`Attendance marked absent for ${student.firstName} ${student.lastName}`);
      }
   }
}

// Function to update attendance for all students
async function autoUpdateAttendance() {
   try {
      // Get all students
      const students = await Student.find({});

      for (const student of students) {
         await updateStudentAttendance(student);
      }

      //console.log('Attendance update completed.');
   } catch (error) {
      console.error(`Error updating attendance: ${error}`);
   }
}

// Create a cron job to run the attendance update daily at midnight
const job = new cron(
   '0 0 0 * * *',
   autoUpdateAttendance,
   null,
   true,
   'Asia/Karachi'
);

module.exports = {
   job,
   autoUpdateAttendance,
};
