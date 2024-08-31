const express = require('express');
const { getJobs, postJob, getJobById, getJobByUserId, deleteJob, updateJob, applyJob } = require('../controllers/job');

const router = express.Router();

// middleware
const requireAuth = require('../middleware/requireAuth');

// use middleware
/* router.use(requireAuth); */

// get all jobs
router.get('/', requireAuth, getJobs);

// post a new job
router.post('/', requireAuth, postJob);

// get a job by id
router.get('/:id', requireAuth, getJobById);

// get job by user id
router.get('/myJobs/:userId', requireAuth, getJobByUserId);

// delete a job
router.delete('/:id', requireAuth, deleteJob);

// update a job
router.put('/:id', requireAuth, updateJob);

// apply for a job
router.post('/apply', requireAuth, applyJob);

module.exports = router;