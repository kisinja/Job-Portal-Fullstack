import express from 'express';
const router = express.Router();
import upload from "../middleware/multerConfig.js";

import requireAuth from "../middleware/requireAuth.js";


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

export default router;