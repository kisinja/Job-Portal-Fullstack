import User from "../models/User.js";
import bcrypt from "bcryptjs";

// update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const  id  = req.params.userId;
    const {
      username,
      email,
      bio,
      userSkills,
      experience,
      education,
      password,
    } = req.body;

    const updateFields = {
      username,
      email,
      bio,
      userSkills: userSkills ? JSON.parse(userSkills) : [],
      experience: parseInt(experience, 10) || 0, // ✅ Fixed
      education: education?.toString() || "", // ✅ Fixed
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      updateFields.profilePic = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Something went wrong" });
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
