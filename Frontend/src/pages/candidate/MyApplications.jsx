import React, { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { Briefcase, Calendar, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await applicationService.getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const statusBadges = {
    APPLIED: 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    SHORTLISTED: 'bg-indigo-50 text-indigo-700 border border-indigo-200/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
    REJECTED: 'bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
    HIRED: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Review the progression status of your active job submissions.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-900 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-16 animate-pulse rounded-xl bg-gray-50 dark:bg-slate-950" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">No Applications Yet</h3>
            <p className="text-sm text-gray-500 mt-2">You haven't applied to any job listings on TalentAI.</p>
            <Link
              to="/jobs"
              className="mt-5 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all dark:bg-indigo-500"
            >
              Search Open Jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800/80">
                <tr className="text-xs font-semibold text-gray-400">
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-850/20">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {app.jobTitle || app.job?.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>{app.companyName || app.job?.company?.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusBadges[app.status] || 'bg-gray-100 text-gray-700'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/jobs/${app.jobId || app.job?.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>View Listing</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
