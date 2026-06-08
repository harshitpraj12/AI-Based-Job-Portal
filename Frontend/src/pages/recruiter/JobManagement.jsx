import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { Briefcase, Calendar, Users, Eye, Trash2, Plus, Edit } from 'lucide-react';

const JobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const jobList = await jobService.getAllJobs();
      const appList = await applicationService.getAllApplications();
      setJobs(jobList);
      setApplications(appList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      // Clean local storage if mock
      const mockJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
      const filtered = mockJobs.filter(j => j.id !== id);
      localStorage.setItem('mock_jobs', JSON.stringify(filtered));
      
      // Update state
      setJobs(jobs.filter(j => j.id !== id));
      alert("Job posting deleted successfully.");
    }
  };

  const getApplicationCount = (jobId) => {
    // Both structure matches: app.jobId or app.job.id
    return applications.filter(a => a.jobId === jobId || a.job?.id === jobId).length;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Active Postings</h1>
          <p className="text-sm text-gray-500 mt-1">Review applicant metrics and statuses of listed positions.</p>
        </div>
        
        <Link
          to="/recruiter/create-job"
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-900 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-16 animate-pulse rounded-xl bg-gray-50 dark:bg-slate-950" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">No Jobs Posted</h3>
            <p className="text-sm text-gray-500 mt-2">You haven't listed any job opportunities yet.</p>
            <Link
              to="/recruiter/create-job"
              className="mt-5 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all dark:bg-indigo-500"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800/80">
                <tr className="text-xs font-semibold text-gray-400">
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Associated Company</th>
                  <th className="px-6 py-4 text-center">Applications</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {jobs.map((job) => {
                  const appCount = getApplicationCount(job.id);
                  return (
                    <tr key={job.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-850/20">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 dark:text-white block">{job.title}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{job.location} &middot; {job.salary}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {job.companyName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          to={`/recruiter/applications?jobId=${job.id}`}
                          className="inline-flex items-center space-x-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <Users className="h-4.5 w-4.5 text-indigo-500" />
                          <span>{appCount} applicants</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2.5 py-0.5 text-xs font-semibold dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/recruiter/applications?jobId=${job.id}`)}
                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                            title="View Applications"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                            title="Edit Listing"
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete Listing"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
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

export default JobManagement;
