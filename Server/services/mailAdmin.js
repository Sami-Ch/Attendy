const mail = require("nodemailer");


//* -------------------------------------------------------------------------send leave request mail
const sendLeaveRequestEmail = async (student, attendanceCount) => {
   const transporter = mail.createTransport({
      service: "gmail",
      auth: {
         user: process.env.MAIL_EMAIL,
         pass: process.env.MAIL_PASSWORD,
      },
   });

   const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: "usamachaudhary12@gmail.com",
      subject: "Leave Request",
      html: `
      <div class="container" style="max-width: 90%; margin: auto; padding-top: 10px">
         <h2>Leave Request from ${student.firstName} ${student.lastName}</h2>
         <h3 style="padding-left: 20px">Reason for leave:</h3>
         <p style="padding-left: 60px">${leaveRequest}</p>
         <p style="text-align:center;">
            <b>Presents:</b> ${attendanceCount.presents} <br>
            <b>Absents:</b> ${attendanceCount.absents} <br>
            <b>Leaves:</b> ${attendanceCount.leaves} <br>
            <b>Total Days:</b> ${attendanceCount.totalAttendance} <br>
         </p>
         <h3 style="letter-spacing: 2px; text-align:center;">Go to admin panel for further operations</h3>
      </div> `,
   };

   await transporter.sendMail(mailOptions);
};
