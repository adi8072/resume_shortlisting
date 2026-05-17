import { recommendJobs, generateInterviewQuestions } from '../services/OpenRouterService.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';
import InterviewQuestions from '../models/InterviewQuestions.js';

export const getAiJobRecommendations = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // Fetch top 10 most recent jobs to match against
    const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(10);
    
    if (jobs.length === 0) return res.json([]);

    const recommendations = await recommendJobs(resume, jobs);
    
    // Map jobId to actual job details
    const populatedRecommendations = recommendations.map(rec => {
      // Assuming AI returns jobId as 1-based index based on the list we sent
      const jobIndex = parseInt(rec.jobId) - 1;
      const matchedJob = jobs[jobIndex];
      return {
        ...rec,
        jobDetails: matchedJob
      };
    }).filter(rec => rec.jobDetails); // filter out invalid indices

    res.json(populatedRecommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAiInterviewQuestions = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Check if we already generated questions for this role for this user
    let interviewQuestions = await InterviewQuestions.findOne({ userId: req.user._id, role });
    
    if (!interviewQuestions) {
      const questions = await generateInterviewQuestions(role);
      
      interviewQuestions = await InterviewQuestions.create({
        userId: req.user._id,
        role,
        questions
      });
    }

    res.json(interviewQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
