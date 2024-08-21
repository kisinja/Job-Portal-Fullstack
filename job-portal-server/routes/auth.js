const express = require('express');
const { loginUser, registerUser, forgotPassword, resetPassword } = require('../controllers/auth');

const router = express.Router();

// login route
router.post("/login", loginUser);

// register route
router.post("/signup", registerUser);

// forgot password route
router.post("/forgot-password", forgotPassword);

// reset password route
router.post("/reset-password/:token", resetPassword);

module.exports = router;