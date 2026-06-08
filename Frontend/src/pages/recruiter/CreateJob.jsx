import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { companyService } from '../../services/companyService';
import { Briefcase, MapPin, DollarSign, BrainCircuit, AlertCircle, Check, ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState(0);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyList = await companyService.getAllCompanies();
        setCompanies(companyList);
        
        if (id) {
          // Editing mode: load job details
          const job = await jobService.getJobById(id);
          setTitle(job.title);
          setLocation(job.location);
          setSalary(job.salary);
          setExperience(job.experience);
          setDescription(job.description);
          if (job.skillsRequires) {
            setSkills(job.skillsRequires.split(',').map(s => s.trim()).filter(Boolean));
          }
          // Match associated company
          if (job.companyId) {
            setCompanyId(job.companyId.toString());
          } else if (companyList.length > 0) {
            // Find company by name fallback
            const match = companyList.find(c => c.companyName === job.companyName);
            setCompanyId(match ? match.id.toString() : companyList[0].id.toString());
          }
        } else {
          // Creating mode
          if (companyList.length > 0) {
            setCompanyId(companyList[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load companies or job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!companyId) {
      setError('Please select or register a company first.');
      toast.error('Please select or register a company first.');
      return;
    }

    setSaving(true);
    try {
      const skillsRequires = skills.join(', ');
      const payload = {
        title,
        description,
        location,
        salary,
        experience: parseInt(experience),
        skillsRequires,
        companyId: parseInt(companyId)
      };

      if (id) {
        await jobService.updateJob(id, payload);
        setSuccess('Job updated successfully!');
        toast.success('Job updated successfully!');
      } else {
        await jobService.createJob(payload);
        setSuccess('Job listed successfully!');
        toast.success('Job listed successfully!');
      }
      
      setTimeout(() => {
        navigate('/recruiter/jobs');
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save job listing.');
      toast.error(err?.response?.data?.message || 'Failed to save job listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      
      {/* Back button */}
      <Link to="/recruiter/jobs" className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to active postings</span>
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {id ? 'Edit Job Listing' : 'Post New Job'}
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          {id ? 'Update the details, compensation, and requirements for this position.' : 'Add details, compensation, and required skills for the position.'}
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-emerald-950/20 dark:text-emerald-400">
          <Check className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
        
        {loading ? (
          <div className="h-44 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-red-500 font-semibold mb-4">No registered company profiles found.</p>
            <Link 
              to="/recruiter/companies" 
              className="inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500"
            >
              <span>Register Company Profile First</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Senior Frontend Engineer"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Company Selection */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Select Company</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Remote / NYC"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Salary Package */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="$120k - $150k"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Experience Required */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Min Experience (Years)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="15"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Job Description</label>
              <textarea
                rows="6"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the job expectations, goals, and daily responsibilities..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
              />
            </div>

            {/* Skills Tag Input */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Required Core Skills</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map(skill => (
                  <span key={skill} className="flex items-center space-x-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl dark:bg-indigo-950/40 dark:text-indigo-400">
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <BrainCircuit className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter required skill tag..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2.5 hover:bg-indigo-100 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700 text-sm font-semibold cursor-pointer"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t dark:border-slate-800">
              <Link
                to="/recruiter/jobs"
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:text-gray-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 disabled:opacity-50 shadow-md cursor-pointer"
              >
                {saving ? 'Saving...' : (id ? 'Save Changes' : 'Post Job Opening')}
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
};

export default CreateJob;
