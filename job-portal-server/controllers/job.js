import Job from "../models/Job.js";
import User from "../models/User.js";
import { checkUserQualification } from "../utils/checkQualification.js";

// post a new job
export const postJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
    });
    if (!job) {
      res.status(400).json({ error: "Error posting job" });
    }

    res.status(200).json({
      message: "Job created Successfully",
      job,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// get all jobs
export const getJobs = async (req, res) => {
  console.log(req.user);

  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "username email")
      .populate("applicants", "username email");
    if (!jobs) {
      res.status(400).json({ error: "No jobs found" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// get a job by id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "username email");
    if (!job) {
      res.status(400).json({ error: "No job found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// get job by user id
export const getJobByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const jobs = await Job.find({ postedBy: userId }).populate("postedBy", "username email");
    if (!jobs) {
      res.status(400).json({ error: "No jobs found" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// delete job by id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      res.status(400).json({ error: "No job found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// update job by id
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) {
      res.status(400).json({ error: "No job found" });
    }

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// apply for a job
export const applyJob = async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user._id;

  try {
    const result = await checkUserQualification(userId, jobId);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    if (!result.qualified) {
      return res.status(400).json({
        qualified: false,
        message: "You don't qualify for this job based on your current skills.",
        missingSkills: result.missingSkills,
        suggestions: result.suggestions,
      });
    }

    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    const alreadyApplied = job.applicants.includes(userId);
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job." });
    }

    // Apply for the job
    job.applicants.push(userId);
    await job.save();

    if (!user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
    }

    res
      .status(200)
      .json({ qualified: true, message: "Application successful!" });
  } catch (error) {
    console.log("ApplyJob Error:", error.message);
    res.status(500).json({ error: "Server error while applying to job." });
  }
};

// get the user applied jobs
export const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find jobs where the user ID is in the applicants array
    const jobs = await Job.find({ applicants: userId })
      .populate("postedBy", "username email")
      .sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "You have not applied for any jobs yet" });
    }

    res.status(200).json({ jobs });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};
