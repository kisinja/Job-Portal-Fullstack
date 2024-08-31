import express from 'express';
import { getJobs, postJob, getJobById, getJobByUserId, deleteJob, updateJob, applyJob, getUserAppliedJobs } from '../controllers/job.js';

const router = express.Router();

// middleware
import requireAuth from '../middleware/requireAuth.js';

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

// get user applied jobs
router.get('/applied/:userId', requireAuth, getUserAppliedJobs);

export default router;