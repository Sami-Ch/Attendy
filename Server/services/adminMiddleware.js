const dotenv = require('dotenv').config();
const Student = require('../models/student.model');
const bcrypt = require('bcryptjs');


// Function to create an admin user
const createAdmin = async () => {
   try {
      const adminExists = await Student.findOne({ email: process.env.ADMIN_EMAIL });

      if (!adminExists) {
         const password = process.env.ADMIN_PASS;
         const hash = await bcrypt.hash(password, 10);
         await Student.create({
            firstName: "Sami",
            lastName: "CH",
            email: process.env.ADMIN_EMAIL,
            role: "admin",
            password: hash,
         });

         console.log('Admin created');
      } else {
         console.log('Admin already exists');
      }
   } catch (err) {
      throw err;
   }
};

// Middleware to check if admin exists and create one if not
const checkAdmin = async (req, res, next) => {
   try {
      await createAdmin();
      next();
   } catch (err) {
      res.status(500).json({
         message: `Error in check: ${err}`,
         error: true,
      });
   }
};


// Middleware to check admin credentials
const checkAdminCredentials = async (req, res, next) => {
   const { adminemail, adminpassword } = req.body;
   let pass = "$2a$10$dD.X8r0VBm2OjdQIKGYp5.4c3kXH/cSMqvb4Q8pI1MiM6mvx0KSJS"
   let t = await bcrypt.compare(process.env.ADMIN_PASS, pass);
   if (adminemail === process.env.ADMIN_EMAIL && t) {
      next();
   } else {
      return res.status(403).json({
         message: 'Access forbidden. You must have admin privileges.',
         error: true
      });
   }
};


module.exports = {
   checkAdmin,
   checkAdminCredentials,
};