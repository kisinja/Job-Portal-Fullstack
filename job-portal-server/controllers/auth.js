const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// create token
const createToken = (_id) => {
    const token = jwt.sign({ _id: _id }, process.env.JWT_SECRET, {
        expiresIn: '3d'
    });

    return token;
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // create token
        const token = createToken(user._id);

        const { _id, username, profilePic, role, resetPasswordToken } = user;

        res.status(200).json({
            _id,
            username,
            profilePic,
            email,
            role,
            token,
            resetPasswordToken
        });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// sign up user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // check if user exists using the signUp method from the User model
        const user = await User.signUp(username, email, password);

        // create token
        const token = createToken(user._id);

        const { profilePic, role, _id, resetPasswordToken } = user;
        res.status(201).json({
            _id,
            username,
            email,
            profilePic,
            role,
            token,
            resetPasswordToken
        });

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        };

        // generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // send email with reset token
        /* const resetURL = `http://localhost:5173/reset-password/${resetToken}`; */

        const resetURL = `https://techposter-frontend.onrender.com/reset-password/${resetToken}`;

        const message = `
            <h1 style="font-size:30px; font-weight:bold; text-align:center;">You have requested a password reset</h1>
            <p style="color:#ccc; font-size:20px; text-align:center;">Please go to this link to reset your password:</p>
            <a href=${resetURL} clicktracking=off>${resetURL}</a>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: message
        });

        res.status(200).json({ message: 'Reset Link sent successfuly' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// reset password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hash the token to compare with the stored hashed token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find the user with the matching hashed token and check if the token has not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password and clear the reset token and expiry fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword
};