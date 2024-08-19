const Job = require('../models/Job');
const mongoose = require('mongoose');

// post a new job
const postJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
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
        const jobs = await Job.find().sort({ createdAt: -1 });
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

    const {userId} = req.params;

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

module.exports = {
    postJob,
    getJobs,
    getJobById,
    getJobByUserId
};