import Job from '../models/Job.js';
import SavedJob from '../models/SavedJob.js';
import Resume from '../models/Resume.js';

export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Simplified local matching logic
export const matchJobs = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const jobs = await Job.find({});
    
    const matchedJobs = jobs.map(job => {
      const matchedSkills = job.requiredSkills.filter(skill =>
        resume.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );
      const score = matchedSkills.length / job.requiredSkills.length;

      return {
        ...job._doc,
        matchScore: score * 100,
        matchedSkills
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const exists = await SavedJob.findOne({ userId: req.user._id, jobId });
    if (exists) return res.status(400).json({ message: 'Job already saved' });

    const savedJob = await SavedJob.create({ userId: req.user._id, jobId });
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user._id }).populate('jobId');
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
