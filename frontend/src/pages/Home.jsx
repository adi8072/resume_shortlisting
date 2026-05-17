import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Target, Brain, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium"
        >
          Powered by OpenRouter AI
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Land your dream job with <span className="text-gradient">AI Analysis</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted mb-10"
        >
          Upload your resume and let our advanced AI extract your skills, analyze your strengths, and recommend the perfect job roles tailored just for you.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4"
        >
          <Link to="/signup" className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-medium shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all hover:-translate-y-1">
            Start Free Analysis <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="bg-surface border border-white/10 hover:bg-white/5 text-white px-8 py-3.5 rounded-xl font-medium transition-all">
            Recruiter Login
          </Link>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <FileText className="w-8 h-8 text-primary" />, title: 'Smart Extraction', desc: 'Instantly parses PDF resumes to extract skills, experience, and education with high accuracy.' },
          { icon: <Brain className="w-8 h-8 text-secondary" />, title: 'AI Insights', desc: 'Get actionable feedback, discover your missing skills, and receive ATS optimization tips.' },
          { icon: <Target className="w-8 h-8 text-blue-500" />, title: 'Precision Matching', desc: 'Our algorithm matches your profile with active jobs and explains exactly why you are a good fit.' }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (idx * 0.1) }}
            className="glass-card p-8 hover:bg-white/[0.02] transition-colors"
          >
            <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
            <p className="text-muted leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
