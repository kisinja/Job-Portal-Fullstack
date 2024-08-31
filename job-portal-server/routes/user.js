import express from 'express';
const router = express.Router();

import requireAuth from "../middleware/requireAuth.js";
import upload from "../middleware/multerConfig.js";

import {updateUserProfile, getUserProfile} from '../controllers/user.js';

// update user profile
router.put("/update/:userId", upload.single("profilePic"), requireAuth, updateUserProfile);

// get user profile
router.get("/:userId", requireAuth, getUserProfile);

export default router;