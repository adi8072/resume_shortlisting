import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData.name, formData.email, formData.password, formData.role);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-muted">Join AI ResumePro today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">I am a</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="candidate"
                  checked={formData.role === 'candidate'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="text-primary focus:ring-primary"
                /> Candidate
              </label>
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="recruiter"
                  checked={formData.role === 'recruiter'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="text-primary focus:ring-primary"
                /> Recruiter
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-muted mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:text-white transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
