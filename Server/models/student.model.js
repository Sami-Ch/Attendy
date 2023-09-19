const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
   //* personal info
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   grade: { type: String, enum: ["A", "B", "C", "D", "E", "F"], required: false },
   attendance: [{
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ["present", "absent", "leave"], },
      leaveRequest: { type: String },
   }],
   sex: { type: String, enum: ["male", "female", "others"] },
   profileImage: {
      __filename: String,
      imageUrl: String,
   },
   attendanceCount: {
      presents: { type: Number, default: 0 },
      absents: { type: Number, default: 0 },
      leaves: { type: Number, default: 0 },
   },
   role: { type: String, enum: ["student", "admin"], default: "student" }, // Add the "role" field
}, { collection: "student" }
);

const Student = mongoose.model("User", studentSchema);

// Export student model
module.exports = Student;
