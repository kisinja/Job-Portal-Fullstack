const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/multerConfig");

const { updateUserProfile, getUserProfile } = require("../controllers/user");

// update user profile
router.put("/update/:userId", upload.single("profilePic"), requireAuth, updateUserProfile);

// get user profile
router.get("/:userId", requireAuth, getUserProfile);

module.exports = router;