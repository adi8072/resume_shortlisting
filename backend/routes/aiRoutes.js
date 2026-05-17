import express from 'express';
import { getAiJobRecommendations, getAiInterviewQuestions } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/recommend', protect, getAiJobRecommendations);
router.post('/interview-questions', protect, getAiInterviewQuestions);

export default router;
