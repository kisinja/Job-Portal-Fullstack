import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import User from '../models/User.js';
import Job from '../models/Job.js';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

export const checkUserQualification = async (userId, jobId) => {
    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user || !job) {
        return { error: 'User or job not found.' };
    }

    const jobSkills = Array.isArray(job.skills) ? job.skills.map(skill => skill.value) : [];
    const userSkills = Array.isArray(user.userSkills) ? user.userSkills : [];

    const missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));
    const experienceMet = user.experience >= job.requiredExperience;
    const educationMet = user.education === job.requiredEducation;

    const qualifies = missingSkills.length === 0 && experienceMet && educationMet;

    if (!qualifies) {
        const chatModel = new ChatOpenAI({
            apiKey: API_KEY,
            temperature: 0.7,
            model: 'gpt-4',
        });

        // Updated prompt asks for JSON array of courses with name and link
        const prompt = `
Suggest beginner to intermediate-level online courses or tutorials for the following skills: ${missingSkills.join(", ")}.
Provide the response as a JSON array of objects with the format:
[
  { "course": "Course Name 1", "courseLink": "https://link.to/course1" },
  { "course": "Course Name 2", "courseLink": "https://link.to/course2" }
]
Only provide the JSON response, no additional text.
        `;

        const messages = [
            new SystemMessage("You are a helpful assistant that recommends online courses for developers to improve their skills."),
            new HumanMessage(prompt),
        ];

        const response = await chatModel.invoke(messages);

        // Try to parse the JSON response
        let suggestions = [];
        try {
            suggestions = JSON.parse(response.content);
        } catch (e) {
            console.error("Failed to parse LLM response as JSON:", e);
            // fallback: return raw text in an array with one element
            suggestions = [{ course: "No structured suggestions available", courseLink: "" }];
        }

        return {
            qualifies: false,
            suggestions,
        };
    }

    return { qualifies: true };
};