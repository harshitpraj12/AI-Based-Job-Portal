import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { 
  Users, FileText, CheckCircle2, XCircle, Clock, 
  Search, ArrowLeftRight, Download, Check, AlertCircle, X,
  Phone, Mail, Award, Briefcase
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ApplicantsManagement = () => {
  const [searchParams] = useSearchParams();
  const filterJobId = searchParams.get('jobId');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Local storage resume retriever
  const [resumes, setResumes] = useState({});

  // Resume Modal States
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState('');
  const [selectedCandidateEmail, setSelectedCandidateEmail] = useState('');
  const [resumeBlob, setResumeBlob] = useState(null);
  const [resumeBlobUrl, setResumeBlobUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [loadingResume, setLoadingResume] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getAllApplications();
      setApplications(data);

      // Load mock resume metadata for each applicant
      const resumeMetaMap = {};
      for (const app of data) {
        const cId = app.candidateId || app.candidate?.id;
        if (cId) {
          const res = await applicationService.getResumeMetadata(cId);
          resumeMetaMap[cId] = res || null;
        }
      }
      setResumes(resumeMetaMap);
    } catch (err) {
      console.error(err);
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus);
      const msg = `Status updated to ${newStatus}!`;
      setSuccess(msg);
      toast.success(msg);
      
      // Update local state directly
      setApplications(prev => prev.map(app => {
        if (app.id === appId) {
          return { ...app, status: newStatus };
        }
        return app;
      }));
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to update status.');
      toast.error('Failed to update status.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Preview & Download Modal opening
  const handleViewResume = async (candId, name, email) => {
    setSelectedCandidateId(candId);
    setSelectedCandidateName(name);
    setSelectedCandidateEmail(email);
    setPreviewOpen(true);
    setLoadingResume(true);
    setResumeBlob(null);
    setResumeBlobUrl('');
    setCandidateProfile(null);

    try {
      // Load candidate's offline profile details if available in local storage
      const cachedProfile = localStorage.getItem(`profile_${candId}`);
      if (cachedProfile) {
        setCandidateProfile(JSON.parse(cachedProfile));
      } else {
        // Generate personalized defaults to prevent showing Jane Doe details under other candidates
        const slug = name.toLowerCase().replace(/\s+/g, '');
        setCandidateProfile({
          phone: '+1 (555) 019-' + Math.floor(1000 + Math.random() * 9000),
          education: [{ id: 1, degree: 'B.S. in Computer Science', school: 'University of Technology', startYear: '2020', endYear: '2024' }],
          experience: 'Software Engineering Intern',
          github: `https://github.com/${slug}`,
          linkedin: `https://linkedin.com/in/${slug}`,
          skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
          profilePhoto: ''
        });
      }

      // Fetch resume blob from applicationService
      const { blob, fileName } = await applicationService.downloadResume(candId);
      setResumeBlob(blob);
      setResumeFileName(fileName);

      if (blob.type === 'application/pdf') {
        const url = URL.createObjectURL(blob);
        setResumeBlobUrl(url);
      }
    } catch (err) {
      console.error("Failed to load resume document details", err);
      toast.error("Failed to load resume preview.");
    } finally {
      setLoadingResume(false);
    }
  };

  // Trigger browser file download directly
  const handleDownload = () => {
    if (!resumeBlob) return;
    const url = URL.createObjectURL(resumeBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resumeFileName || 'resume.pdf';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  // Clean up object URL on close
  const handleClosePreview = () => {
    if (resumeBlobUrl) {
      URL.revokeObjectURL(resumeBlobUrl);
    }
    setPreviewOpen(false);
    setResumeBlobUrl('');
    setResumeBlob(null);
    setCandidateProfile(null);
  };

  // Filter application list by jobId if query parameter exists
  const displayedApps = filterJobId 
    ? applications.filter(a => a.jobId === parseInt(filterJobId) || a.job?.id === parseInt(filterJobId))
    : applications;

  const statusColors = {
    APPLIED: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    SHORTLISTED: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
    REJECTED: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
    HIRED: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
  };

  return (
    <div className="space-y-6">
      
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-lg dark:bg-emerald-950/20 dark:text-emerald-400"
          >
            <Check className="h-5 w-5" />
            <span>{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-lg dark:bg-red-950/20 dark:text-red-400"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Applicant Profiles</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filterJobId 
            ? `Displaying candidates for Job ID: ${filterJobId}` 
            : 'Review, shortlist, and manage all candidate job applications.'}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-900 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-16 animate-pulse rounded-xl bg-gray-50 dark:bg-slate-950" />
            ))}
          </div>
        ) : displayedApps.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">No Applications Yet</h3>
            <p className="text-sm text-gray-500 mt-2">No candidates have applied for this position yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800/80">
                <tr className="text-xs font-semibold text-gray-400">
                  <th className="px-6 py-4">Candidate Name</th>
                  <th className="px-6 py-4">Position Applied</th>
                  <th className="px-6 py-4">Resume CV</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {displayedApps.map((app) => {
                  const candId = app.candidateId || app.candidate?.id;
                  const candName = app.candidate?.name || app.candidateName || 'Candidate';
                  const candEmail = app.candidate?.email || 'email@jobportal.com';
                  const resume = resumes[candId];
                  return (
                    <tr key={app.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-850/20">
                      
                      {/* Candidate Name */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 dark:text-white block">{candName}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{candEmail}</span>
                      </td>

                      {/* Position */}
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                        {app.jobTitle || app.job?.title}
                      </td>

                      {/* Resume File link */}
                      <td className="px-6 py-4">
                        {resume ? (
                          <button
                            onClick={() => handleViewResume(candId, candName, candEmail)}
                            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <span className="truncate max-w-[150px]">{resume.fileName}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">No CV Uploaded</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                          {app.status}
                        </span>
                      </td>

                      {/* Status select editor */}
                      <td className="px-6 py-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className={`rounded-lg border py-1.5 px-2.5 text-xs font-semibold outline-none cursor-pointer transition-colors ${statusColors[app.status] || 'bg-gray-50 text-gray-700'}`}
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="HIRED">Hired</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resume Preview & Download Dialog Popup */}
      <AnimatePresence>
        {previewOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleClosePreview}
              className="fixed inset-0 z-40 bg-black"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-40%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-40%' }}
              className="fixed top-1/2 left-1/2 w-full max-w-3xl rounded-3xl border border-gray-250 bg-white p-6 shadow-2xl z-50 dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Candidate CV Document</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Applicant Name: <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCandidateName}</span></p>
                </div>
                <button onClick={handleClosePreview} className="p-1 rounded-lg hover:bg-gray-150 dark:hover:bg-slate-800 transition cursor-pointer">
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Preview Body */}
              <div className="flex-1 overflow-y-auto min-h-[350px] max-h-[500px] border border-gray-150 rounded-xl bg-gray-50/50 p-4 dark:border-slate-850 dark:bg-slate-950/40">
                {loadingResume ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 py-16">
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></span>
                    <span className="text-xs text-gray-500 font-semibold">Retrieving CV Document...</span>
                  </div>
                ) : resumeBlobUrl ? (
                  // PDF Blob display
                  <iframe 
                    src={resumeBlobUrl} 
                    title="Resume Preview" 
                    className="w-full h-[450px] rounded-lg border-none"
                  />
                ) : (
                  // Elegant visual candidate profile template as preview fallback (for mock mode / txt files)
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b dark:border-slate-850">
                      
                      {/* Name & Photo */}
                      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        {candidateProfile?.profilePhoto ? (
                          <img 
                            src={candidateProfile.profilePhoto} 
                            alt="Avatar" 
                            className="h-16 w-16 rounded-full object-cover border-2 border-indigo-150 dark:border-indigo-900 shadow-sm"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center font-bold text-xl text-indigo-600 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400 shrink-0">
                            {selectedCandidateName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="text-center sm:text-left">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCandidateName}</h4>
                          <span className="inline-flex rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 mt-1 border border-indigo-100 dark:border-indigo-900/50">Candidate Professional</span>
                        </div>
                      </div>

                      {/* Contact metadata */}
                      <div className="text-xs text-gray-500 mt-4 sm:mt-0 space-y-1 text-center sm:text-right">
                        <p className="flex items-center justify-center sm:justify-end space-x-1.5"><Mail className="h-3.5 w-3.5" /> <span>{selectedCandidateEmail}</span></p>
                        <p className="flex items-center justify-center sm:justify-end space-x-1.5"><Phone className="h-3.5 w-3.5" /> <span>{candidateProfile?.phone || '+1 (555) 019-2834'}</span></p>
                      </div>

                    </div>

                    {/* Social profiles */}
                    <div className="grid grid-cols-2 gap-4 border-b pb-4 dark:border-slate-850">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wide">LinkedIn</span>
                        {candidateProfile?.linkedin ? (
                          <a href={candidateProfile.linkedin} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 mt-0.5">
                            <LinkedinIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate max-w-[150px]">{candidateProfile.linkedin}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Not Provided</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wide">GitHub</span>
                        {candidateProfile?.github ? (
                          <a href={candidateProfile.github} target="_blank" rel="noreferrer" className="text-xs text-gray-700 dark:text-gray-300 hover:underline flex items-center space-x-1 mt-0.5">
                            <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate max-w-[150px]">{candidateProfile.github}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Not Provided</span>
                        )}
                      </div>
                    </div>

                    {/* Education history */}
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center space-x-1">
                        <Award className="h-4 w-4 text-indigo-500" />
                        <span>Education background</span>
                      </h5>
                      <div className="space-y-3">
                        {candidateProfile && Array.isArray(candidateProfile.education) ? (
                          candidateProfile.education.map((edu, index) => (
                            <div key={edu.id || index} className="pl-4 border-l-2 border-indigo-100 dark:border-slate-800 text-xs">
                              <p className="font-bold text-gray-900 dark:text-white">{edu.degree || 'Degree Not Mentioned'}</p>
                              <p className="text-gray-500 mt-0.5">{edu.school || 'School Not Mentioned'} {edu.startYear && `(${edu.startYear} - ${edu.endYear})`}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">{candidateProfile?.education || 'No details provided.'}</p>
                        )}
                      </div>
                    </div>

                    {/* Professional Experience */}
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center space-x-1">
                        <Briefcase className="h-4 w-4 text-indigo-500" />
                        <span>Professional experience</span>
                      </h5>
                      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-950/60 p-3 rounded-xl">
                        {candidateProfile?.experience || 'No experience details specified.'}
                      </p>
                    </div>

                    {/* Technical skills list */}
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Technical skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {candidateProfile && Array.isArray(candidateProfile.skills) ? (
                          candidateProfile.skills.map(skill => (
                            <span key={skill} className="text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-100/40 dark:border-indigo-900/40">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">None Specified</span>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="flex justify-end space-x-3 border-t pt-4 mt-4 dark:border-slate-800">
                <button
                  onClick={handleClosePreview}
                  className="rounded-xl border border-gray-250 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-slate-850 dark:text-gray-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resumeBlob}
                  className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume File</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ApplicantsManagement;
