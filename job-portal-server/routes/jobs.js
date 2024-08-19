const express = require('express');
const { getJobs, postJob, getJobById, getJobByUserId } = require('../controllers/job');

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

module.exports = router;