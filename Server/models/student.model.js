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
      status: { type: String, enum: ["present", "absent", "leave"], default: "absent" },
      leaveRequest: { type: String },
      count: {
         presents: { type: Number },
         absents: { type: Number },
         leaves: { type: Number },
         total: { type: Number },
      },
   }],
   sex: { type: String, enum: ["male", "female", "others"] },
   profileImage: {
      __filename: String,
      imageData: Buffer,
   },
}, { collection: "student" }
);

const Student = mongoose.model("User", studentSchema);

//export student model
module.exports = Student;