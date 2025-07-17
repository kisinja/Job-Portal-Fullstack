import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import Job from '../models/Job.js';
import User from '../models/User.js';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

export const suggestCourses = async (req, res) => {
    const { jobId } = req.body;
    const { userId } = req.user._id;

    if (!jobId || !userId) {
        return res.status(400).json({ error: "jobId and userId are required." });
    }

    try {
        const job = await Job.findById(jobId);
        const user = await User.findById(userId);

        if (!job || !user) {
            return res.status(404).json({ error: "Job or user not found." });
        }

        const jobSkills = Array.isArray(job.skills) ? job.skills.map(s => s.value) : [];
        const userSkills = Array.isArray(user.userSkills) ? user.userSkills : [];

        const missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));
        const experienceRequirementMet = user.experience >= job.requiredExperience;
        const educationRequirementMet = user.education === job.requiredEducation;

        if (missingSkills.length === 0 && experienceRequirementMet && educationRequirementMet) {
            return res.status(200).json({ message: "You qualify for this job!" });
        }

        // If user doesn't qualify, suggest courses based on missing skills
        if (missingSkills.length === 0) {
            return res.status(200).json({
                message: "You don't meet all requirements, but no specific skills are missing.",
            });
        }

        const chatModel = new ChatOpenAI({
            apiKey: API_KEY,
            temperature: 0.7,
            model: 'gpt-4'
        });

        const messages = [
            new SystemMessage("You are a helpful assistant that recommends online courses for developers to improve their skills."),
            new HumanMessage(`Suggest beginner to intermediate-level online courses or tutorials for the following skills: ${missingSkills.join(", ")}. Provide clickable links where possible.`),
        ];

        const response = await chatModel.invoke(messages);
        console.log("LLM Response:", response.content);

        res.status(200).json({ suggestions: response.content });
    } catch (error) {
        console.error("Error in suggestCourses:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};