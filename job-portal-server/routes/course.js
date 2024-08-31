import express from 'express';
const router = express.Router();

import { suggestCourses } from '../controllers/course.js';

import requireAuth from '../middleware/requireAuth.js';

// suggest courses
router.get("/suggest-courses", requireAuth, suggestCourses);

export default router;