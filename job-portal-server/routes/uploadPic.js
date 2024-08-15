const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");

const requireAuth = require("../middleware/requireAuth");


router.post("/uploadPic", upload.single("profilePic"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file" });
        }
        console.log(req.file);
        res.status(200).json({
            message: "File uploaded successfully",
            data: req.file,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;