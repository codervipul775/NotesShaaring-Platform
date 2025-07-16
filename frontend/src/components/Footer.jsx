import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className="footer  py-12 px-4 md:px-12 mt-12 w-full border-t border-primary/20 shadow-lg" style={{
      background: isDark 
        ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 50%, var(--chart-2) 100%)'
        : 'linear-gradient(135deg, #71cfc9 100%, #bae6fd 100%)'
    }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        <div className="flex-1 flex flex-col items-start gap-3 min-w-[220px]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-foreground rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>NoteNest</span>
          </div>
          <p className={`text-sm max-w-xs leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
            Share Knowledge, Learn Together. NoteNest is a collaborative platform for sharing, discovering, and reviewing study notes and resources. Empower your learning journey with our community!
          </p>
        </div>
        <div className="flex-1 flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <h4 className={`font-semibold mb-4 text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/" className={`${isDark ? 'text-white/90 hover:text-primary-foreground' : 'text-gray-700 hover:text-primary'} transition-colors duration-200 hover:translate-x-1 inline-block`}>Home</Link></li>
              <li><Link to="/browse" className={`${isDark ? 'text-white/90 hover:text-primary-foreground' : 'text-gray-700 hover:text-primary'} transition-colors duration-200 hover:translate-x-1 inline-block`}>Browse Notes</Link></li>
              <li><Link to="/upload" className={`${isDark ? 'text-white/90 hover:text-primary-foreground' : 'text-gray-700 hover:text-primary'} transition-colors duration-200 hover:translate-x-1 inline-block`}>Upload Notes</Link></li>
              <li><Link to="/doubts" className={`${isDark ? 'text-white/90 hover:text-primary-foreground' : 'text-gray-700 hover:text-primary'} transition-colors duration-200 hover:translate-x-1 inline-block`}>Doubts</Link></li>
              <li><Link to="/dashboard" className={`${isDark ? 'text-white/90 hover:text-primary-foreground' : 'text-gray-700 hover:text-primary'} transition-colors duration-200 hover:translate-x-1 inline-block`}>Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className={`${isDark ? 'text-white/90 hover:text-primary-foreground' : 'text-gray-700 hover:text-primary'} transition-colors duration-200 hover:translate-x-1 inline-block`}>Login</Link></li>
              <li><Link to="/signup" className={`${isDark ? 'text-white/90 hover:text-primary-foreground' : 'text-gray-700 hover:text-primary'} transition-colors duration-200 hover:translate-x-1 inline-block`}>Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={`max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-xs gap-2 border-t pt-6 ${isDark ? 'text-white border-white/30' : 'text-gray-600 border-gray-300'}`}>
        <span>© {new Date().getFullYear()} NoteNest. All rights reserved.</span>
        <span className={`font-medium ${isDark ? ' text-white' : 'text-grey'}`}>Made for learners everywhere.</span>
      </div>
    </footer>
  );
} 