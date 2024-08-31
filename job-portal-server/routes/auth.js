import express from 'express';
import { loginUser, registerUser, forgotPassword, resetPassword } from '../controllers/auth.js';

const router = express.Router();

// login route
router.post("/login", loginUser);

// register route
router.post("/signup", registerUser);

// forgot password route
router.post("/forgot-password", forgotPassword);

// reset password route
router.post("/reset-password/:token", resetPassword);

export default router;