const mail = require("nodemailer");


//* -------------------------------------------------------------------------send leave request mail
const sendLeaveRequestEmail = async (student, attendanceCount, leaveRequest) => {
   const transporter = mail.createTransport({
      service: "gmail",
      auth: {
         user: process.env.MAIL_EMAIL,
         pass: process.env.MAIL_PASSWORD,
      },
   });

   const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Leave Request",
      html: `
      <div class="container" style="max-width: 100%; margin: auto; padding-top: 10px">
         <h2>Leave Request from ${student.firstName} ${student.lastName}</h2>
         <h3 style="">Reason for leave:</h3>
         <p >${leaveRequest}</p>
         <p style="text-align:center;" >
            <b style="color:#008000;" >Presents:</b> ${attendanceCount.presents} <br>
            <b style="color:#ff0000;" >Absents:</b> ${attendanceCount.absents} <br>
            <b style="color:#0000ff;" >Leaves:</b> ${attendanceCount.leaves} <br>
            <b>Total Days:</b> ${attendanceCount.totalAttendance} <br>
         </p>
         <h3 style="letter-spacing: 2px; text-align:center;">Go to admin panel for further operations</h3>
      </div> `,
   };

   await transporter.sendMail(mailOptions);
};

module.exports = { sendLeaveRequestEmail }