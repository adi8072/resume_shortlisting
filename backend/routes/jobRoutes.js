import express from 'express';
import { createJob, getJobs, getJobById, matchJobs, saveJob, getSavedJobs } from '../controllers/jobController.js';
import { protect, recruiter } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, recruiter, createJob);
router.get('/', getJobs);
router.get('/saved', protect, getSavedJobs);
router.get('/:id', getJobById);

router.post('/match', protect, matchJobs);
router.post('/save', protect, saveJob);

export default router;
