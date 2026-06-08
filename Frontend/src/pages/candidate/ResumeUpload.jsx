import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';
import { UploadCloud, FileText, Check, Trash2, Eye, Loader2 } from 'lucide-react';

const ResumeUpload = () => {
  const { user } = useAuth();
  const [resumeMeta, setResumeMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadResumeMeta = async () => {
    const data = await applicationService.getResumeMetadata(user?.id);
    setResumeMeta(data);
  };

  useEffect(() => {
    loadResumeMeta();
  }, [user]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    
    setLoading(true);
    try {
      await applicationService.uploadResume(file);
      setSuccessMsg('Resume uploaded successfully!');
      await loadResumeMeta();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveResume = () => {
    localStorage.removeItem(`mock_resume_${user?.id || 'me'}`);
    setResumeMeta(null);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Upload Resume</h1>
        <p className="text-sm text-gray-500 mt-1">Upload a PDF copy of your CV. Recruiters will be able to review and download this file directly.</p>
      </div>

      {successMsg && (
        <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-emerald-950/20 dark:text-emerald-400">
          <Check className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Drag Drop Panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
        
        {!resumeMeta ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center transition ${
              dragActive 
                ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-400 dark:bg-indigo-950/10' 
                : 'border-gray-200 hover:bg-gray-50/30 dark:border-slate-800 dark:hover:bg-slate-850/20'
            }`}
          >
            {loading ? (
              <div className="space-y-3">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-gray-700">Uploading resume, please wait...</p>
              </div>
            ) : (
              <>
                <div className="rounded-full bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Drag and Drop your CV</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-sm leading-relaxed">
                  Support PDF files only. Maximum file size 5MB.
                </p>
                <div className="mt-6">
                  <label className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm">
                    Browse Files
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Uploaded Resume Detail Card */
          <div className="flex flex-col sm:flex-row items-center justify-between border border-gray-200 rounded-xl p-4 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-950/40 gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-xs">{resumeMeta.fileName}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Uploaded on: {new Date(resumeMeta.uploadDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const { blob } = await applicationService.downloadResume(user?.id);
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                  } catch (err) {
                    console.error(err);
                    alert("Failed to view resume.");
                  }
                }}
                className="flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 border rounded-lg px-3 py-2 bg-white dark:bg-slate-900 dark:border-slate-850"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </a>
              <button
                onClick={handleRemoveResume}
                className="flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 border border-red-100 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 dark:border-red-950/30"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
