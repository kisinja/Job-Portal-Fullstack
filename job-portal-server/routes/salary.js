const express = require('express');
const router = express.Router();

const { getSalaryEstimate } = require('../controllers/salary');

// Get estimated salary for a job
router.post('/estimate', getSalaryEstimate);

module.exports = router;