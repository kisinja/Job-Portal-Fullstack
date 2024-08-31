const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

// post a new job
const postJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id
        });
        if (!job) {
            res.status(400).json({ error: "Error posting job" });
        }

        res.status(200).json({
            message: "Job created Successfully",
            job
        });
    } catch (error) {
        console.log(error.message);
        res.json({ error: error.message }).status(500);
    }
};

// get all jobs
const getJobs = async (req, res) => {

    console.log(req.user);

    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).populate('postedBy', 'username email').populate('applicants', 'username email');
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
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
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
const getJobByUserId = async (req, res) => {

    const { userId } = req.params;

    try {
        const jobs = await Job.find({ postedBy: userId });
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
const deleteJob = async (req, res) => {
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
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
const applyJob = async (req, res) => {
    const { userId, jobId } = req.body;

    try {
        const job = await Job.findById(jobId);
        const user = await User.findById(userId);
        if (!job || !user) {
            res.status(400).json({ error: "No job or user found" });
        }

        // check if the user has already applied
        const alreadyApplied = job.applicants.includes(userId);
        if (alreadyApplied) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // add the user to the applicants list
        job.applicants.push(userId);
        await job.save();

        // add the job to the user's applied jobs list
        user.appliedJobs.push(jobId);
        await user.save();

        res.status(200).json({ message: 'Application Successful !' });

    } catch (error) {
        console.log(error.message);
        res.json({ error: error.message }).status(500);
    }
};

module.exports = {
    postJob,
    getJobs,
    getJobById,
    getJobByUserId,
    deleteJob,
    updateJob,
    applyJob
};