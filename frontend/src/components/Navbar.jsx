import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BookOpen, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings,
  Search,
  Plus,
  MessageCircle
} from 'lucide-react';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleAuthChange = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate('/');
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <nav className="sticky top-0 z-50 theme-transition navbar-gradient border-b border-primary/20 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group hover-scale"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-light rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                NoteNest
              </span>
              <span className="text-xs text-white/80 -mt-1">Share Knowledge</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/browse" 
              className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Browse</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/upload" 
                  className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Upload</span>
                </Link>
                <Link 
                  to="/doubts" 
                  className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Doubts</span>
                </Link>
                <Link 
                  to="/history" 
                  className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Notes</span>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover-scale group border border-white/20"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white group-hover:text-accent-light transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-white group-hover:text-accent-light transition-colors" />
              )}
            </button>
            {isAuthenticated ? (
              <div className="relative flex items-center space-x-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover-scale border border-white/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white">Account</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-6 mt-2 w-48 max-w-xs bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg animate-scale-in">
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-card-foreground hover:bg-accent/10 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-card-foreground hover:bg-accent/10 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Notes</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-accent to-accent-dark text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                >
                  Get Started
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              <Link
                to="/browse"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <Search className="w-4 h-4" />
                <span>Browse</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/upload"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload</span>
                  </Link>
                  <Link
                    to="/doubts"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Doubts</span>
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Notes</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}