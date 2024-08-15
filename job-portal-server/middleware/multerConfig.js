const multer = require('multer');
const path = require('path');

/* -------------Multer Configuration ------------------ */
// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

// Set up multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images only!");
        }
    },
});

module.exports = upload;