import express from 'express';
import { uploadResume, getMyResumes, getResumeAnalysis } from '../controllers/resumeController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getMyResumes);
router.get('/:id/analysis', protect, getResumeAnalysis);

export default router;
