import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import User from "../models/User.js";
import Job from "../models/Job.js";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

export const checkUserQualification = async (userId, jobId) => {
  if (!jobId || !userId) {
    return { error: "jobId and userId are required." };
  }

  try {
    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    if (!job || !user) {
      return { error: "Job or user not found." };
    }

    const jobSkills = Array.isArray(job.skills)
      ? job.skills.map((s) => s.value)
      : [];
    const userSkills = Array.isArray(user.userSkills) ? user.userSkills : [];

    const missingSkills = jobSkills.filter(
      (skill) => !userSkills.includes(skill)
    );

    if (missingSkills.length === 0) {
      return { qualified: true };
    }

    // Use GPT to suggest learning resources
    const chatModel = new ChatOpenAI({
      apiKey: API_KEY,
      temperature: 0.7,
      model: "gpt-4",
    });

    const prompt = `
Suggest beginner to intermediate-level online courses or tutorials for the following skills: ${missingSkills.join(
      ", "
    )}.
Provide the response as a JSON array of objects with the format:
[
  { "course": "Course Name 1", "courseLink": "https://link.to/course1" },
  { "course": "Course Name 2", "courseLink": "https://link.to/course2" }
]
Only provide the JSON response, no additional text.
        `;

    const messages = [
      new SystemMessage(
        "You are a helpful assistant that recommends online courses for developers to improve their skills."
      ),
      new HumanMessage(prompt),
    ];

    const response = await chatModel.invoke(messages);

    return {
      qualified: false,
      suggestions: response.content,
      missingSkills,
    };
  } catch (error) {
    console.error("Error in checkUserQualification:", error);
    return { error: "Internal server error." };
  }
};
