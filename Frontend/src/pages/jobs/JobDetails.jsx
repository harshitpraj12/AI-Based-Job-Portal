import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';
import { 
  ArrowLeft, MapPin, Briefcase, DollarSign, BrainCircuit, 
  Bookmark, Check, AlertCircle, Building2, Globe, ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isSaved, setIsSaved] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    return saved.includes(parseInt(id));
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobData = await jobService.getJobById(id);
        setJob(jobData);

        // Fetch company details (or mock)
        // Since we are mocking/linking, companies list has descriptions
        const companies = await apiRequestGetCompanies();
        const comp = companies.find(c => c.companyName === jobData.companyName);
        setCompany(comp || {
          companyName: jobData.companyName,
          website: 'https://google.com',
          location: jobData.location,
          description: 'A leading innovative tech company looking for talented individuals to join their scaling engineering team.'
        });
      } catch (err) {
        setError('Job details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  // Temporary local helper to fetch companies without service circular dependencies
  const apiRequestGetCompanies = async () => {
    try {
      const { companyService } = await import('../../services/companyService');
      return await companyService.getAllCompanies();
    } catch {
      return [];
    }
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    let updated;
    const jobIdInt = parseInt(id);
    if (saved.includes(jobIdInt)) {
      updated = saved.filter(item => item !== jobIdInt);
      setIsSaved(false);
    } else {
      updated = [...saved, jobIdInt];
      setIsSaved(true);
    }
    localStorage.setItem('saved_jobs', JSON.stringify(updated));
  };

  const handleApply = async () => {
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
      await applicationService.applyJob(job.id);
      setSuccess('Applied successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to apply.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold">Error Loading Job</h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <Link to="/jobs" className="mt-4 inline-flex items-center space-x-2 text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Alert toast notifications */}
      {error && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-lg dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-lg dark:bg-emerald-950/40 dark:text-emerald-400">
          <Check className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Back button */}
      <Link to="/jobs" className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to browse jobs</span>
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full dark:bg-indigo-950/40 dark:text-indigo-400">
                {job.companyName}
              </span>
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </span>
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <Briefcase className="h-3 w-3" />
                <span>{job.experience} Yrs Experience Required</span>
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-6">{job.title}</h1>
            
            <div className="grid grid-cols-2 gap-4 border-t border-b py-5 my-6 border-gray-100 dark:border-slate-800">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Salary Package</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{job.salary || 'Competitive'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Job Type</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Full-time</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Job Description</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.skillsRequires && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Required Technical Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequires.split(',').map(skill => (
                    <span key={skill} className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-lg dark:bg-slate-800 dark:text-gray-300">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions and Company Card */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900 text-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Interested in this role?</h3>
            <p className="text-xs text-gray-500 mb-6">Review your profile details and resume upload before clicking submit.</p>
            
            <div className="space-y-3">
              <button
                onClick={handleApply}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md"
              >
                Apply to Position
              </button>
              <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center space-x-2 rounded-xl border py-3 text-sm font-semibold transition ${
                  isSaved 
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-400' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-850'
                }`}
              >
                <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Job Saved' : 'Save for Later'}</span>
              </button>
            </div>
          </div>

          {/* Company Card */}
          {company && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{company.companyName}</h3>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gray-400 hover:text-indigo-600 flex items-center space-x-0.5 mt-0.5"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>{company.website?.replace('https://', '')}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mt-2">
                {company.description}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default JobDetails;
