import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import Job from "../models/Job.js";
import User from "../models/User.js";

const API_KEY = process.env.OPENAI_API_KEY;

export const suggestCourses = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

  if (!jobId || !userId) {
    return res.status(400).json({ error: "jobId and userId are required." });
  }

  try {
    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    if (!job || !user) {
      return res.status(404).json({ error: "Job or user not found." });
    }

    const jobSkills = Array.isArray(job.skills)
      ? job.skills.map((s) => s.value)
      : [];
    const userSkills = Array.isArray(user.userSkills) ? user.userSkills : [];

    const missingSkills = jobSkills.filter(
      (skill) => !userSkills.includes(skill)
    );

    if (missingSkills.length === 0) {
      // Check if user already applied
      const alreadyApplied = job.applicants.includes(userId);
      if (!alreadyApplied) {
        job.applicants.push(userId);
        await job.save();
      }

      return res
        .status(200)
        .json({
          message:
            "You qualify for this job and your application has been submitted!",
        });
    }

    // If missing skills exist, use GPT to suggest learning resources
    const chatModel = new ChatOpenAI({
      apiKey: API_KEY,
      temperature: 0.7,
      model: "gpt-4",
    });

    const messages = [
      new SystemMessage(
        "You are a helpful assistant that recommends online courses for developers to improve their skills."
      ),
      new HumanMessage(
        `Suggest beginner to intermediate-level online courses or tutorials for the following skills: ${missingSkills.join(
          ", "
        )}. Provide clickable links where possible.`
      ),
    ];

    const response = await chatModel.invoke(messages);
    console.log("LLM Response:", response.content);

    res.status(200).json({
      message: "You do not meet all the skill requirements for this job.",
      missingSkills,
      suggestions: response.content,
    });
  } catch (error) {
    console.error("Error in suggestCourses:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};