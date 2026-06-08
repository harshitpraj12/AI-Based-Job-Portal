import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { 
  Briefcase, CheckCircle, Clock, Award, ChevronRight, 
  User, Check, FileText, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load candidate applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Compute stat metrics
  const totalApps = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'HIRED').length;
  const pendingCount = applications.filter(a => a.status === 'APPLIED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;

  const stats = [
    { label: 'Total Applications', value: totalApps, icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Shortlisted / Hired', value: shortlistedCount, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Pending Reviews', value: pendingCount, icon: Clock, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Profile Completion', value: '85%', icon: Award, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' }
  ];

  // Chart Data: Monthly applications (mock)
  const monthlyData = [
    { month: 'Jan', applications: 2 },
    { month: 'Feb', applications: 5 },
    { month: 'Mar', applications: 3 },
    { month: 'Apr', applications: 8 },
    { month: 'May', applications: 6 },
    { month: 'Jun', applications: totalApps || 4 },
  ];

  // Chart Data: Status distribution
  const statusData = [
    { name: 'Applied', value: pendingCount || 2, color: '#F59E0B' },
    { name: 'Shortlisted', value: shortlistedCount || 1, color: '#10B981' },
    { name: 'Rejected', value: rejectedCount || 1, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Overview Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Track your job applications, profile matches, and status distributions.</p>
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

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Applications Monthly Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="applications" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Status Distribution</h3>
          <div className="h-64 flex flex-col justify-between items-center">
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="flex justify-center space-x-4 w-full border-t pt-4 dark:border-slate-800">
              {statusData.map(item => (
                <div key={item.name} className="flex items-center space-x-1.5 text-xs">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-gray-500">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Recent Applications list */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Job Applications</h3>
          <Link to="/candidate/applications" className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(n => (
              <div key={n} className="h-14 animate-pulse rounded-xl bg-gray-50 dark:bg-slate-950" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400">You haven't applied to any jobs yet.</p>
            <Link to="/jobs" className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              <span>Find jobs</span> <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 border-b dark:border-slate-800">
                  <th className="pb-3">Position</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Applied Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 3).map((app) => {
                  const statusColors = {
                    APPLIED: 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
                    SHORTLISTED: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400',
                    REJECTED: 'text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400',
                    HIRED: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400'
                  };
                  return (
                    <tr key={app.id} className="border-b last:border-b-0 dark:border-slate-800">
                      <td className="py-4 font-bold text-gray-900 dark:text-white">{app.jobTitle || app.job?.title}</td>
                      <td className="py-4 text-gray-500">{app.companyName || app.job?.company?.companyName}</td>
                      <td className="py-4 text-gray-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[app.status] || 'text-gray-600 bg-gray-50'}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default CandidateDashboard;
