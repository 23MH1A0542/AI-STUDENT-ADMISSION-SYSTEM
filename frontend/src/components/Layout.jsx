import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  BarChart3, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import Chatbot from './Chatbot';

const Layout = ({ children }) => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [];
  
  if (isStudent) {
    navItems.push(
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Courses Catalog', path: '/courses', icon: BookOpen },
      { label: 'AI Recommender', path: '/recommendations', icon: Sparkles }
    );
  } else if (isAdmin) {
    navItems.push(
      { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
      { label: 'Review Applications', path: '/admin/applications', icon: FileText },
      { label: 'Reports & Stats', path: '/admin/analytics', icon: BarChart3 }
    );
  } else {
    // Guest items
    navItems.push(
      { label: 'Courses Catalog', path: '/courses', icon: BookOpen }
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-brand-600">
                <GraduationCap className="h-8 w-8 stroke-[2.5]" />
                <span className="font-bold text-xl tracking-tight text-slate-800">Zenith Admissions</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile / Auth State */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800">{user.full_name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link to="/login" className="btn-secondary text-xs px-3 py-1.5">Sign In</Link>
                  <Link to="/register" className="btn-primary text-xs px-3 py-1.5">Apply Now</Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-2 pt-2 pb-3 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {user ? (
              <div className="pt-4 pb-2 border-t border-slate-200 mt-2">
                <div className="flex items-center px-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold mr-3">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium text-base"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200 mt-2 px-3 flex flex-col space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full">Apply Now</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Floating Admissions Chatbot Drawer */}
      <Chatbot />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Zenith University. All rights reserved.</p>
          <p className="mt-1 text-slate-600">Built with React, FastAPI, PostgreSQL, and Google Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
