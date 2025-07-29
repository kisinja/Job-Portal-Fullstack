import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getSalaryEstimate = async (req, res) => {
  try {
    const { experienceLevel, jobTitle, location, industry } = req.body;

    if (!experienceLevel || !jobTitle || !location || !industry) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    const prompt = `
You are a helpful assistant that estimates average annual salaries in USD.
Given the following job information:

- Job Title: ${jobTitle}
- Experience Level: ${experienceLevel}
- Location: ${location}
- Industry: ${industry}

Estimate a realistic salary range (min and max) for this position. Respond ONLY with a JSON object like:
{
  "minSalary": number,
  "maxSalary": number,
  "comment": "optional explanation"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // You can also use 'gpt-3.5-turbo' if needed
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0].message.content;

    // Parse response safely
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid response format from OpenAI");

    const salaryData = JSON.parse(match[0]);

    res.status(200).json({
      estimatedSalary: {
        min: salaryData.minSalary,
        max: salaryData.maxSalary,
        comment: salaryData.comment || "",
      },
    });
  } catch (error) {
    console.error("Error estimating salary:", error.message);
    res.status(500).json({ error: "Failed to estimate salary" });
  }
};
