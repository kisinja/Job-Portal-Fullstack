const express = require('express');
const { getJobs, postJob, getJobById, getJobByUserId, deleteJob } = require('../controllers/job');

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

module.exports = router;