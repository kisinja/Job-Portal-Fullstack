import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, bio, userSkills } = req.body; // Ensure userSkills is included
        const password = req.body.password || null;
        const profilePic = req.file ? req.file.filename : "";

        // Initialize the updatedData object
        const updatedData = {
            username,
            email,
            bio,
            userSkills: userSkills ? JSON.parse(userSkills) : [], // Parse userSkills from JSON
        };

        // Include profilePic if it's provided
        if (profilePic) {
            updatedData.profilePic = profilePic;
        }

        // Handle password hashing if a new password is provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Update the user profile in the database
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        // Check if the user exists after the update attempt
        if (!user) {
            throw new Error('User not found');
        }

        // Respond with a success message and the updated user profile
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        // Respond with an error message if something goes wrong
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
};


// get user profile
export const getUserProfile = async (req, res) => {

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