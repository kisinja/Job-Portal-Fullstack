import express from 'express';

const router = express.Router();

import {
    createResume,
    getResumeByUserId,
    updateResume,
    deleteResume,
    generateResumePDF
} from "../controllers/resume.js";

import requireAuth from '../middleware/requireAuth.js';

router.post("/", requireAuth, createResume);
router.get('/', requireAuth, getResumeByUserId);
router.put('/:resumeId', requireAuth, updateResume);
router.delete('/:resumeId', requireAuth, deleteResume);
router.get('/:resumeId/pdf', requireAuth, generateResumePDF);

export default router;