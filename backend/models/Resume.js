import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  parsedText: {
    type: String
  },
  skills: [{
    type: String
  }],
  experience: {
    type: Number,
    default: 0
  },
  education: {
    type: String
  },
  projects: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  aiScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
