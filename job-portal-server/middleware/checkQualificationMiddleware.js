import User from '../models/User.js';
import Job from '../models/Job.js';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

export const checkQualificationMiddleware = async (req, res, next) => {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const job = await Job.findById(jobId);

        if (!user || !job) {
            return res.status(404).json({ error: 'User or job not found.' });
        }

        const jobSkills = Array.isArray(job.skills) ? job.skills.map(skill => skill.value) : [];
        const userSkills = Array.isArray(user.userSkills) ? user.userSkills : [];

        const missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));
        const experienceMet = user.experience >= job.requiredExperience;
        const educationMet = user.education === job.requiredEducation;

        const qualifies = missingSkills.length === 0 && experienceMet && educationMet;

        if (!qualifies) {
            // Call LLM to suggest courses
            const chatModel = new ChatOpenAI({
                apiKey: API_KEY,
                temperature: 0.7,
                model: 'gpt-4',
            });

            const prompt = `Suggest beginner to intermediate-level online courses or tutorials for the following skills: ${missingSkills.join(", ")}. Provide clickable links where possible.`;

            const messages = [
                new SystemMessage("You are a helpful assistant that recommends online courses for developers to improve their skills."),
                new HumanMessage(prompt),
            ];

            const response = await chatModel.invoke(messages);

            return res.status(400).json({
                message: "You don't qualify for this job. Here are some suggested courses.",
                suggestions: response.content
            });
        }

        // Continue to next handler (applyJob)
        next();
    } catch (error) {
        console.error("Middleware error:", error);
        res.status(500).json({ error: "Error checking qualifications." });
    }
};
