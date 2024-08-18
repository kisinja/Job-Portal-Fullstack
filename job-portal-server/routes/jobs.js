const express = require('express');
const { getJobs, postJob, getJobById } = require('../controllers/job');

const router = express.Router();

// middleware
const requireAuth = require('../middleware/requireAuth');

// use middleware
router.use(requireAuth);

// get all jobs
router.get('/', getJobs);

// post a new job
router.post('/', postJob);

// get a job by id
router.get('/:id', getJobById);


module.exports = router;