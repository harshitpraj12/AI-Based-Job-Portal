import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { 
  User, Mail, Phone, Code, Award, Briefcase, 
  Save, Plus, X, Camera, Trash2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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

const CandidateProfile = () => {
  const { user } = useAuth();
  
  // Local profile states with localStorage fallback
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem(`profile_${user?.id || 'me'}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Migrate education if it is a string
        if (typeof parsed.education === 'string') {
          parsed.education = [
            { id: Date.now(), degree: parsed.education, school: '', startYear: '', endYear: '' }
          ];
        }
        // Ensure array if empty or corrupted
        if (!Array.isArray(parsed.education)) {
          parsed.education = [];
        }
        if (!parsed.profilePhoto) {
          parsed.profilePhoto = '';
        }
        if (!parsed.skills) {
          parsed.skills = [];
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing cached profile, using defaults", e);
      }
    }
    return {
      phone: '',
      education: [
        { id: Date.now(), degree: '', school: '', startYear: '', endYear: '' }
      ],
      experience: '',
      github: '',
      linkedin: '',
      skills: [],
      profilePhoto: ''
    };
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(`profile_${user?.id || 'me'}`, JSON.stringify(profile));
    toast.success('Profile saved successfully!');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  // Multiple Education Handlers
  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      school: '',
      startYear: '',
      endYear: ''
    };
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const handleRemoveEducation = (eduId) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== eduId)
    }));
  };

  const handleEduChange = (eduId, field, value) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu => {
        if (edu.id === eduId) {
          return { ...edu, [field]: value };
        }
        return edu;
      })
    }));
  };

  // Profile Photo Upload (Base64 conversion)
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

  // Profile Completion logic
  const completionPercentage = (() => {
    let score = 0;
    if (user?.name) score += 20;
    if (user?.email) score += 20;
    if (profile.phone) score += 15;
    if (profile.education && profile.education.length > 0 && profile.education[0].school) score += 15;
    if (profile.experience) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 15;
    return score;
  })();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your professional identity and social details.</p>
      </div>

      {/* Completion Progress Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Profile Completion</span>
          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 dark:bg-slate-800">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500 dark:bg-indigo-500" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-2">A complete profile increases interview chances by up to 3x.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Personal Metadata */}
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
            <p className="text-xs text-gray-400 font-medium mt-0.5">{user?.email}</p>
          </div>
          
          {/* Social URL Fields */}
          <div className="border-t pt-5 text-left space-y-5 dark:border-slate-800">
            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold mb-1">LinkedIn Profile</label>
              <div className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950">
                <LinkedinIcon className="h-4 w-4 shrink-0 text-indigo-500" />
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-transparent outline-none w-full text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold mb-1">GitHub Profile</label>
              <div className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950">
                <GithubIcon className="h-4 w-4 shrink-0 text-gray-500" />
                <input
                  type="url"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="bg-transparent outline-none w-full text-xs"
                />
              </div>
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
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Primary Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 pl-9 pr-3 text-sm outline-none dark:border-slate-800 dark:bg-slate-900 opacity-60 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Multiple Education Editor */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Education History</label>
              <button
                type="button"
                onClick={handleAddEducation}
                className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {profile.education.map((edu, idx) => (
              <div 
                key={edu.id} 
                className="relative p-4 rounded-xl border border-gray-150 bg-gray-55/30 dark:border-slate-800 dark:bg-slate-950/60 space-y-3"
              >
                {profile.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">School / University</label>
                    <input
                      type="text"
                      required
                      value={edu.school}
                      onChange={(e) => handleEduChange(edu.id, 'school', e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full rounded-lg border border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 py-2 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Degree / Qualification</label>
                    <input
                      type="text"
                      required
                      value={edu.degree}
                      onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full rounded-lg border border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 py-2 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <div>
                    <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Start Year</label>
                    <input
                      type="text"
                      value={edu.startYear}
                      onChange={(e) => handleEduChange(edu.id, 'startYear', e.target.value)}
                      placeholder="e.g. 2020"
                      className="w-full rounded-lg border border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 py-2 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">End Year (or Expected)</label>
                    <input
                      type="text"
                      value={edu.endYear}
                      onChange={(e) => handleEduChange(edu.id, 'endYear', e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full rounded-lg border border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 py-2 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Professional Experience</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <textarea
                rows="2"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Skill Tag Editor */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Technical Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map(skill => (
                <span key={skill} className="flex items-center space-x-1 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl dark:bg-indigo-950/40 dark:text-indigo-400">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Code className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill tag (e.g. Next.js)..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950"
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
                className="rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 p-2.5 hover:bg-indigo-100 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>
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

export default CandidateProfile;
