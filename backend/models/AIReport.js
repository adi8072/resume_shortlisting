import mongoose from 'mongoose';

const aiReportSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  strengths: [{
    type: String
  }],
  weaknesses: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  atsOptimizationSuggestions: [{
    type: String
  }],
  careerRecommendations: [{
    type: String
  }]
}, { timestamps: true });

export default mongoose.model('AIReport', aiReportSchema);
