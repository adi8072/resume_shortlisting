import mongoose from 'mongoose';

const interviewQuestionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    category: {
      type: String,
      enum: ['technical', 'hr', 'skill-based']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    aiAnswer: String
  }]
}, { timestamps: true });

export default mongoose.model('InterviewQuestions', interviewQuestionsSchema);
