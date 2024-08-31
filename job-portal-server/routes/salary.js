import express from 'express';
const router = express.Router();

import { getSalaryEstimate } from '../controllers/salary.js';

// Get estimated salary for a job
router.post('/estimate', getSalaryEstimate);

export default router;