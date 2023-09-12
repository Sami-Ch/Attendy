// import libraries
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const { job, autoUpdateAttendance } = require("./services/autoUpdateAtendance");
const path = require('path')
// import routes
const studentRoutes = require("./Routes/studentRoute");
const adminRoutes = require('./Routes/adminRoute');

const app = express();

// database connection
async function connectToDatabase() {
   try {
      await mongoose.connect(process.env.DATABASE_STRING, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         writeConcern: { w: 'majority' },
      });
      console.log('Connected to MongoDB');
   } catch (error) {
      console.error('Error connecting to MongoDB:', error);
   }
}

const db = mongoose.connection;

connectToDatabase();

const corsOptions = {
   origin: 'http://localhost:5173',
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
   optionsSuccessStatus: 204,
};


// middleware
app.use(cors());
app.use(bodyParser.json());

//routes
app.use("/", studentRoutes);
app.use("/", adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// autoUpdateAttendance()
// scheduler
job.start();

// run app
app.listen(process.env.PORT, function () {
   console.log("Server is running on Port: " + process.env.PORT);
});
