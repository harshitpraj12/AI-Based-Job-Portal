import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { companyService } from '../../services/companyService';
import { 
  Building2, Briefcase, Users, Award, 
  ChevronRight, Calendar, UserPlus, Check 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Legend, CartesianGrid 
} from 'recharts';

const RecruiterDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apps = await applicationService.getAllApplications();
        const jbs = await jobService.getAllJobs();
        const comps = await companyService.getAllCompanies();
        
        setApplications(apps);
        setJobs(jbs);
        setCompanies(comps);
      } catch (err) {
        console.error("Failed to load recruiter analytics dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCompanies = companies.length;
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const hiredCount = applications.filter(a => a.status === 'HIRED').length;

  const stats = [
    { label: 'Total Companies', value: totalCompanies, icon: Building2, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Active Jobs', value: totalJobs, icon: Briefcase, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Total Applications', value: totalApps, icon: Users, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Hired Talents', value: hiredCount, icon: Award, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' }
  ];

  // Chart Data: Jobs Posted vs Applications Monthly (mock data)
  const trendsData = [
    { month: 'Jan', Jobs: 1, Applications: 4 },
    { month: 'Feb', Jobs: 3, Applications: 8 },
    { month: 'Mar', Jobs: 2, Applications: 6 },
    { month: 'Apr', Jobs: 5, Applications: 12 },
    { month: 'May', Jobs: 4, Applications: 15 },
    { month: 'Jun', Jobs: totalJobs || 4, Applications: totalApps || 18 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Recruiter Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Review active pipeline statistics, postings distributions, and candidate trends.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3.5 rounded-xl ${stat.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Trend Area Chart (Applications vs Posted Jobs) */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Jobs vs Applications Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" name="Jobs Posted" dataKey="Jobs" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
                <Area type="monotone" name="Applications" dataKey="Applications" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipelines summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Candidate Pipeline Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs border-b pb-3 dark:border-slate-800">
                <span className="text-gray-400 font-semibold">Total Submissions</span>
                <span className="font-extrabold text-gray-900 dark:text-white">{totalApps}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b pb-3 dark:border-slate-800">
                <span className="text-gray-400 font-semibold">Shortlisted Profiles</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  {applications.filter(a => a.status === 'SHORTLISTED').length}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b pb-3 dark:border-slate-800">
                <span className="text-gray-400 font-semibold">Successful Hires</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{hiredCount}</span>
              </div>
            </div>
          </div>
          
          <Link
            to="/recruiter/applications"
            className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-50 py-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-750 transition"
          >
            <span>Review Applications</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Recent Activity Feed</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(n => (
              <div key={n} className="h-10 animate-pulse bg-gray-50 dark:bg-slate-950 rounded-xl" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No recent activity found.</p>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 3).map((app) => (
              <div key={app.id} className="flex items-start justify-between border-b last:border-b-0 pb-3 last:pb-0 dark:border-slate-850">
                <div className="flex items-start space-x-3 text-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {app.candidate?.name || app.candidateName || 'Candidate'} applied for{' '}
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {app.job?.title || app.jobTitle}
                      </span>
                    </p>
                    <p className="text-gray-400 mt-0.5">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-gray-400 flex items-center space-x-0.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default RecruiterDashboard;
