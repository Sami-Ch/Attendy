const Student = require('../models/student.model');
const cron = require("cron").CronJob;                      //* <-----scedulling library

// update attendance for all students
async function autoUpdateAttendance() {
   try {
      // get all students
      const students = await Student.find({});
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      // Iterate through each student and check if attendance for today exists
      for (const student of students) {
         if (student.role === 'student') {
            const attendanceToday = student.attendance.find(
               (entry) =>
                  new Date(entry.date).toDateString() === yesterday.toDateString()
            );

            if (!attendanceToday) {
               // If attendance for today does not exist, add a new entry with "absent" status
               student.attendance.push({
                  date: yesterday,
                  status: 'absent',
               });
               await student.save();
               console.log(`Attendance marked absent for ${student.firstName} ${student.lastName}`);
            }
         }
      }

      console.log('Attendance update completed.');
   } catch (error) {
      console.error(`Error updating attendance: ${error}`);
   }
}


const job = new cron(
   '0 0 0 * * *', () => {
      console.log('====================================');
      console.log('autoUpdateAttendance');
      autoUpdateAttendance();
      console.log('====================================');
   },
   null,
   true,
   'Asia/Karachi'
);
module.exports = {
   job,
   autoUpdateAttendance,
};