import React, { useEffect, useState } from 'react';
import { companyService } from '../../services/companyService';
import { 
  Building2, MapPin, Globe, Plus, X, 
  Check, AlertCircle, Edit, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCompany(null);
    setCompanyName('');
    setWebsite('');
    setLocation('');
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingCompany(company);
    setCompanyName(company.companyName);
    setWebsite(company.website);
    setLocation(company.location);
    setDescription(company.description);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (editingCompany) {
        await companyService.updateCompany(editingCompany.id, { companyName, website, location, description });
        setSuccess('Company updated successfully!');
        toast.success('Company updated successfully!');
      } else {
        await companyService.createCompany({ companyName, website, location, description });
        setSuccess('Company registered successfully!');
        toast.success('Company registered successfully!');
      }
      
      // Reset form
      setCompanyName('');
      setWebsite('');
      setLocation('');
      setDescription('');
      setEditingCompany(null);
      
      setModalOpen(false);
      await fetchCompanies();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save company.');
      toast.error(err?.response?.data?.message || 'Failed to save company.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {success && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-lg dark:bg-emerald-950/20 dark:text-emerald-400">
          <Check className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Company Profiles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and register company profiles linked to your job listings.</p>
        </div>
        
        {/* Register Company Button */}
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Register Company</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2].map(n => (
            <div key={n} className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-900" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center rounded-2xl border border-dashed p-16 dark:border-slate-800">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">No Companies Registered</h3>
          <p className="text-sm text-gray-500 mt-2">Create a company profile first before listing any jobs.</p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-5 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 cursor-pointer"
          >
            Register Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-900 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{company.companyName}</h3>
                    <span className="text-[10px] text-gray-400 flex items-center space-x-0.5 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{company.location}</span>
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                  {company.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-150 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center space-x-0.5"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                
                <button
                  onClick={() => handleOpenEditModal(company)}
                  className="flex items-center space-x-1 text-xs font-semibold bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              className="fixed top-1/2 left-1/2 w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl z-50 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingCompany ? 'Edit Company Profile' : 'Register New Company'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="cursor-pointer">
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {error && (
                <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Notion Inc."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Website URL</label>
                    <input
                      type="url"
                      required
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    rows="3"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter details of the company..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:text-gray-300 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CompanyManagement;
