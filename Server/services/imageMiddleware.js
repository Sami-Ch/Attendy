const multer = require('multer');

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
      cb(null, `${req.body._id.toString()}'s profile.webP`);
   },
});

const upload = multer({ storage: storage });

module.exports = upload;