import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { UploadCloud, FileText, Briefcase, Award, Loader2, Target, HelpCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user.role === 'recruiter' && activeTab === 'upload') {
      setActiveTab('jobs');
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(data);
      toast.success('Resume analyzed successfully!');
      setActiveTab('analysis');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!analysis) return toast.error('Please upload and analyze a resume first');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/recommend', { resumeId: analysis.resume._id });
      setRecommendations(data);
      setActiveTab('matches');
    } catch (error) {
      toast.error('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <div className="glass-card p-4 sticky top-24">
          <div className="space-y-2">
            {user.role === 'candidate' && (
              <>
                <button onClick={() => setActiveTab('upload')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'upload' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <UploadCloud className="w-5 h-5" /> Upload Resume
                </button>
                <button onClick={() => setActiveTab('analysis')} disabled={!analysis} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!analysis ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'analysis' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <FileText className="w-5 h-5" /> AI Analysis
                </button>
                <button onClick={() => { if(analysis) fetchRecommendations(); else toast.error('Analyze a resume first') }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'matches' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <Target className="w-5 h-5" /> Job Matches
                </button>
              </>
            )}
            {user.role === 'recruiter' && (
              <button onClick={() => setActiveTab('jobs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'jobs' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Briefcase className="w-5 h-5" /> Post a Job
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'upload' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
            <form onSubmit={handleFileUpload} className="space-y-6">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors bg-white/[0.02]">
                <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-gray-300 mb-4">Drag and drop your PDF here, or click to browse</p>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full max-w-xs mx-auto text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 transition-all cursor-pointer"
                />
              </div>
              <button type="submit" disabled={loading || !file} className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : 'Analyze Resume'}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'analysis' && analysis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Resume Score</h2>
                <p className="text-muted">Based on ATS compatibility and impact</p>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center bg-primary/10">
                <span className="text-3xl font-bold text-primary">{analysis.aiReport.score}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 border-t-4 border-t-green-500">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-400"><Award className="w-5 h-5"/> Strengths</h3>
                <ul className="space-y-2">
                  {analysis.aiReport.strengths.map((item, i) => <li key={i} className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">{item}</li>)}
                </ul>
              </div>
              <div className="glass-card p-6 border-t-4 border-t-red-500">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-400"><HelpCircle className="w-5 h-5"/> Weaknesses</h3>
                <ul className="space-y-2">
                  {analysis.aiReport.weaknesses.map((item, i) => <li key={i} className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">{item}</li>)}
                </ul>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold text-lg mb-4 text-blue-400">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.resume.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">{skill}</span>
                ))}
              </div>
            </div>
            
            <button onClick={fetchRecommendations} disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex justify-center items-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Matching...</> : 'Find Matching Jobs'}
            </button>
          </motion.div>
        )}

        {activeTab === 'matches' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Target className="text-primary"/> AI Recommended Jobs</h2>
            {recommendations.length === 0 ? (
              <p className="text-muted">No specific matches found in our database currently.</p>
            ) : (
              recommendations.map((rec, i) => (
                <div key={i} className="glass-card p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{rec.jobDetails.title}</h3>
                      <p className="text-gray-400 text-sm">{rec.jobDetails.company}</p>
                    </div>
                    <div className="bg-primary/20 text-primary font-bold px-3 py-1 rounded-lg border border-primary/30">
                      {rec.matchScore}% Match
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/5">
                    <p className="text-sm text-gray-300 leading-relaxed"><span className="text-primary font-semibold">AI Note:</span> {rec.aiExplanation}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rec.jobDetails.requiredSkills.map((skill, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs rounded-full ${analysis?.resume?.skills?.includes(skill) ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-white/10 text-gray-400 border border-white/10'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'jobs' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
             <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
             <p className="text-muted mb-6">Create a job listing and let our AI match the best candidates for you.</p>
             {/* Simple placeholder for job posting form */}
             <div className="p-8 border border-white/10 rounded-xl bg-white/5 text-center text-gray-400">
               Job posting form would go here.
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
