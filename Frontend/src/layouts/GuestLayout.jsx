import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { Sun, Moon, Briefcase, Building2, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GuestLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-gray-100">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:bg-indigo-500 dark:shadow-none">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Talent<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/jobs" className="text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              Browse Jobs
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 hover:bg-gray-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-20">
                      <Link
                        to={user.role === 'CANDIDATE' ? '/candidate/dashboard' : '/recruiter/dashboard'}
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:shadow-indigo-100 transition dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-1.5 text-gray-600 dark:text-gray-400"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col space-y-3">
                <Link
                  to="/jobs"
                  className="text-gray-700 dark:text-gray-300 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to={user.role === 'CANDIDATE' ? '/candidate/dashboard' : '/recruiter/dashboard'}
                      className="text-gray-700 dark:text-gray-300 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center text-red-600 py-1"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                    <Link
                      to="/login"
                      className="text-center rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 dark:border-slate-800 dark:text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white dark:bg-indigo-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Multi-Column Footer */}
      <footer className="border-t border-gray-200 bg-white text-gray-600 dark:border-slate-900 dark:bg-slate-950 dark:text-gray-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Talent<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <p className="mt-4 text-sm">
                Next generation AI-powered job board matching elite candidates with scaling startups.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Explore</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400">Find Jobs</Link></li>
                <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Join as Talent</Link></li>
                <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Hire Candidates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Guides</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">AI Resume Advice</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">SaaS Hiring Secrets</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Cookie Preferences</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-100 pt-6 text-center text-xs dark:border-slate-900">
            &copy; {new Date().getFullYear()} TalentAI, Inc. All rights reserved. Made for high performance.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
