import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { 
  Briefcase, LayoutDashboard, Search, FileText, User, Settings, Bell, 
  Sun, Moon, LogOut, Menu, X, ArrowLeftRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'Browse Jobs', path: '/jobs', icon: Search },
    { name: 'My Applications', path: '/candidate/applications', icon: Briefcase },
    { name: 'Profile', path: '/candidate/profile', icon: User },
    { name: 'Resume', path: '/candidate/resume', icon: FileText }
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-gray-100 overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-gray-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900">
        {/* Brand */}
        <div className="flex h-16 items-center px-6 border-b border-gray-100 dark:border-slate-800">
          <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md dark:bg-indigo-500">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">TalentAI</span>
          </Link>
        </div>

        {/* User context badge */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-3 rounded-xl bg-gray-50 p-3 dark:bg-slate-950/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <User className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800/40 dark:hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content pane */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Header bar */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 z-30">
          
          {/* Left: Mobile trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-3 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">TalentAI</Link>
          </div>

          <div className="hidden lg:block text-sm text-gray-500 dark:text-gray-400 font-medium">
            Welcome back, <span className="font-semibold text-gray-800 dark:text-white">{user?.name}</span>
          </div>

          {/* Right: Tools & Profile */}
          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600"></span>
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-20 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <h4 className="font-semibold text-sm border-b pb-2 mb-2">Notifications</h4>
                      <div className="space-y-3">
                        <div className="text-xs">
                          <p className="font-medium text-gray-900 dark:text-white">Application Shortlisted!</p>
                          <p className="text-gray-500">Linear App shortlisted your application for Senior Frontend Engineer.</p>
                          <span className="text-[10px] text-indigo-500 font-semibold">10 minutes ago</span>
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-gray-900 dark:text-white">New Job Posted</p>
                          <p className="text-gray-500">Notion Labs posted a new job for Technical Product Manager.</p>
                          <span className="text-[10px] text-gray-400">2 hours ago</span>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0)}
                </div>
              </button>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg z-20 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <Link
                        to="/candidate/profile"
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50 dark:bg-slate-950/50">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 shadow-2xl lg:hidden dark:bg-slate-900"
            >
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="h-6 w-6" />
                  <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">TalentAI</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              
              <div className="absolute bottom-6 left-6 right-6 border-t pt-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CandidateLayout;
