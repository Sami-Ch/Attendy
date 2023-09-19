const dotenv = require('dotenv').config();
const Student = require('../models/student.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


// Function to create an admin user
const createAdmin = async () => {
   try {
      const count = await Student.countDocuments({});

      if (count == 0) {
         const password = process.env.ADMIN_PASS;
         const hash = await bcrypt.hash(password, 10);
         await Student.create({
            firstName: "Sami",
            lastName: "CH",
            email: process.env.ADMIN_EMAIL,
            role: "admin",
            password: hash,
         });

         //console.log('Admin created');
      }
      else {
         //console.log('gori');
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

            //console.log('Admin created');
         } else {
            //console.log('Admin already exists');
         }
      }
   } catch (err) {
      console.error(err);
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
   try {
      const token = req.headers.authorization;
      const key = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, key);
      let t = await bcrypt.compare(process.env.ADMIN_PASS, decoded.password);
      if (decoded.role === 'admin' && t)
         next();
   } catch (error) {
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