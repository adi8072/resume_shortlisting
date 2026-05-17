import Resume from '../models/Resume.js';
import AIReport from '../models/AIReport.js';
import { extractTextFromPDF } from '../services/PdfParserService.js';
import { analyzeResume } from '../services/OpenRouterService.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // 1. Extract text
    const parsedText = await extractTextFromPDF(filePath);

    // 2. Pass to AI for analysis
    const aiAnalysis = await analyzeResume(parsedText);

    // 3. Save Resume
    const resume = await Resume.create({
      userId: req.user._id,
      fileName,
      fileUrl: filePath,
      parsedText,
      skills: aiAnalysis.skills || [],
      experience: aiAnalysis.experience || 0,
      education: aiAnalysis.education || '',
      projects: aiAnalysis.projects || [],
      certifications: aiAnalysis.certifications || [],
      aiScore: aiAnalysis.score || 0
    });

    // 4. Save AI Report
    const aiReport = await AIReport.create({
      resumeId: resume._id,
      score: aiAnalysis.score || 0,
      strengths: aiAnalysis.strengths || [],
      weaknesses: aiAnalysis.weaknesses || [],
      missingSkills: aiAnalysis.missingSkills || [],
      atsOptimizationSuggestions: aiAnalysis.atsOptimizationSuggestions || [],
      careerRecommendations: aiAnalysis.careerRecommendations || []
    });

    res.status(201).json({
      resume,
      aiReport
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getResumeAnalysis = async (req, res) => {
  try {
    const aiReport = await AIReport.findOne({ resumeId: req.params.id });
    const resume = await Resume.findById(req.params.id);
    
    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'recruiter') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({ resume, aiReport });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
