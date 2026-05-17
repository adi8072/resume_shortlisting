import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b-0 rounded-none bg-surface/60 border-white/5 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
          <BrainCircuit className="text-primary w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          AI ResumePro
        </span>
      </Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-muted hover:text-white transition-colors">Dashboard</Link>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-1.5 rounded-full">
                  <UserIcon className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-300">{user.name}</span>
              </div>
              <button 
                onClick={logout}
                className="text-muted hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-muted hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
