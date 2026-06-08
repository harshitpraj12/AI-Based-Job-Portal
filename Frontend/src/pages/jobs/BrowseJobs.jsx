import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';
import { 
  Search, MapPin, Briefcase, DollarSign, BrainCircuit, 
  Bookmark, Check, ChevronRight, X, AlertCircle 
} from 'lucide-react';

const BrowseJobs = () => {
  const { user, isAuthenticated, isCandidate } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Saved jobs local memory
  const [savedJobIds, setSavedJobIds] = useState(() => {
    return JSON.parse(localStorage.getItem('saved_jobs') || '[]');
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [skillQuery, setSkillQuery] = useState('');
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAllJobs();
        setJobs(data);
      } catch (err) {
        setError('Could not load jobs. Please check connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSaveJob = (id) => {
    let updated;
    if (savedJobIds.includes(id)) {
      updated = savedJobIds.filter(item => item !== id);
    } else {
      updated = [...savedJobIds, id];
    }
    setSavedJobIds(updated);
    localStorage.setItem('saved_jobs', JSON.stringify(updated));
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isCandidate) {
      setError('Only Candidates can apply for jobs!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await applicationService.applyJob(jobId);
      setSuccess('Applied successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to apply.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter Logic
  const filteredJobs = jobs.filter(job => {
    const matchSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchLocation = locationQuery === '' || 
      job.location.toLowerCase().includes(locationQuery.toLowerCase());

    const matchRemote = !isRemote || 
      job.location.toLowerCase().includes('remote');

    const matchExperience = experienceFilter === '' || 
      job.experience <= parseInt(experienceFilter);

    const matchSalary = salaryFilter === '' || 
      job.salary.toLowerCase().includes(salaryFilter.toLowerCase());

    const matchSkills = skillQuery === '' || 
      (job.skillsRequires && job.skillsRequires.toLowerCase().includes(skillQuery.toLowerCase()));

    return matchSearch && matchLocation && matchRemote && matchExperience && matchSalary && matchSkills;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-lg dark:bg-red-950/40 dark:text-red-400"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-lg dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            <Check className="h-5 w-5" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Explore Career Opportunities</h1>
        <p className="text-sm text-gray-500 mt-1">Discover, filter, and apply to elite technology job listings.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* Left Side: Filter Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 h-fit">
          <div className="flex items-center justify-between border-b pb-4 mb-5">
            <span className="text-sm font-bold tracking-wider text-gray-400 uppercase">Filters</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setLocationQuery('');
                setExperienceFilter('');
                setSalaryFilter('');
                setSkillQuery('');
                setIsRemote(false);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-5">
            
            {/* Search Query */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title, description..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950"
                />
              </div>
            </div>

            {/* Location Query */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City, country..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950"
                />
              </div>
            </div>

            {/* Remote Checkbox */}
            <div className="flex items-center space-x-2.5 pt-2">
              <input
                type="checkbox"
                id="remote-checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
              />
              <label htmlFor="remote-checkbox" className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                Remote Only
              </label>
            </div>

            {/* Experience Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Experience</label>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{experienceFilter ? `${experienceFilter} Yrs` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-800"
              />
            </div>

            {/* Skill Requirement */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Required Skills</label>
              <div className="relative">
                <BrainCircuit className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder="React, Figma..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Jobs Cards */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            [1, 2, 3].map(n => (
              <div key={n} className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-900" />
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="text-center rounded-2xl border border-dashed p-12 dark:border-slate-800">
              <p className="text-lg font-bold text-gray-500">No jobs found</p>
              <p className="text-sm text-gray-400 mt-1">Try updating your filters or search keywords.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <motion.div
                  key={job.id}
                  layout
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-slate-900 dark:bg-slate-900"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    
                    {/* Job Details Left */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full dark:bg-indigo-950/40 dark:text-indigo-400">
                          {job.companyName}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </span>
                        <span className="text-xs text-gray-400 flex items-center space-x-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{job.experience} Yrs Exp</span>
                        </span>
                      </div>
                      
                      <Link to={`/jobs/${job.id}`} className="block mt-3 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{job.title}</h3>
                      </Link>
                      
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {job.skillsRequires && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {job.skillsRequires.split(',').map(skill => (
                            <span key={skill} className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md dark:bg-slate-800 dark:text-gray-300">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Job Actions Right */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800">
                      <div className="flex flex-col md:items-end">
                        <span className="text-[10px] text-gray-400">Salary Package</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{job.salary || 'Competitive'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Save Button */}
                        <button
                          onClick={() => handleSaveJob(job.id)}
                          className={`rounded-xl border p-2.5 transition ${
                            isSaved 
                              ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-400' 
                              : 'border-gray-200 hover:bg-gray-50 text-gray-400 dark:border-slate-800 dark:hover:bg-slate-800'
                          }`}
                          title={isSaved ? 'Unsave Job' : 'Save Job'}
                        >
                          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        {/* Apply Button */}
                        <button
                          onClick={() => handleApply(job.id)}
                          className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                          <span>Apply Now</span>
                          <ChevronRight className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default BrowseJobs;
