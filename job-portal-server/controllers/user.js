const User = require('../models/User');
const bcrypt = require('bcryptjs');

// update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, bio } = req.body;
        const password = req.body.password ? req.body.password : req.body.password;
        const profilePic = req.file ? req.file.filename : "";

        const updatedData = { username, email, password, bio };
        if (profilePic) {
            updatedData.profilePic = profilePic;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        };

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!user) {
            throw new Error('User not found');
        }

        res.json({ message: "Profile updated successfully", user }).status(200);
    } catch (error) {
        res.json({ error: error.message }).status(500);
        console.log(error.message);
    }
};

// get user profile
const getUserProfile = async (req, res) => {

    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.json({ error: "User not found" }).status(404);
        }

        res.json({ user }).status(200);
    } catch (error) {
        res.json({ error: error.message }).status(500);
        console.log(error.message);
    }
};

module.exports = {
    updateUserProfile,
    getUserProfile
};