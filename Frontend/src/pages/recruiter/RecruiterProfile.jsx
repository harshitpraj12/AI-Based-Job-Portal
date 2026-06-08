import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { 
  User, Mail, Phone, Building2, Save, Camera, X 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const RecruiterProfile = () => {
  const { user } = useAuth();

  // Local storage profile database for recruiters
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem(`profile_recruiter_${user?.id || 'me'}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to load recruiter cached details, using defaults");
      }
    }
    return {
      phone: '+1 (555) 019-3221',
      companyName: 'Notion Labs',
      bio: 'Head of Talent & Engineering Recruitment at Notion Labs. Passionate about hiring top fullstack and design talents.',
      profilePhoto: ''
    };
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(`profile_recruiter_${user?.id || 'me'}`, JSON.stringify(profile));
    toast.success('Recruiter profile updated successfully!');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
        toast.success("Profile photo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Recruiter Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your recruiter profile and company details.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Recruiter Metadata & Avatar */}
        <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900 text-center space-y-6 h-fit">
          <div className="flex flex-col items-center">
            
            {/* Avatar Photo Frame */}
            <div className="relative group mb-4">
              {profile.profilePhoto ? (
                <img 
                  src={profile.profilePhoto} 
                  alt="Avatar" 
                  className="h-28 w-28 rounded-full object-cover border-4 border-indigo-150 dark:border-indigo-900/60 shadow-md"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-indigo-50 border-4 border-indigo-100 flex items-center justify-center font-extrabold text-4xl text-indigo-600 dark:bg-indigo-950 dark:border-indigo-900/60 dark:text-indigo-400 shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <label 
                htmlFor="photo-upload" 
                className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md transition-all scale-95 hover:scale-105"
              >
                <Camera className="h-4 w-4" />
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  className="hidden" 
                />
              </label>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <span className="inline-flex rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 mt-1 border border-indigo-100 dark:border-indigo-900/50">Hiring Team Lead</span>
            <p className="text-xs text-gray-400 font-medium mt-1">{user?.email}</p>
          </div>
          
          <div className="border-t pt-5 text-left space-y-4 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">Associated Company</span>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1 flex items-center space-x-1.5">
                <Building2 className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>{profile.companyName || 'Not Set'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Card: Details Form */}
        <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Recruiter Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 pl-9 pr-3 text-sm outline-none dark:border-slate-800 dark:bg-slate-900 opacity-60 cursor-not-allowed text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Company Association Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Recruiter Profile Bio</label>
            <textarea
              rows="4"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
              placeholder="Tell applicants about your role and hiring goals..."
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end pt-4 border-t dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition shadow-md cursor-pointer"
            >
              <Save className="h-4.5 w-4.5" />
              <span>Save Changes</span>
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};

export default RecruiterProfile;
