import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import GuestLayout from '../layouts/GuestLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import RecruiterLayout from '../layouts/RecruiterLayout';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BrowseJobs from '../pages/jobs/BrowseJobs';
import JobDetails from '../pages/jobs/JobDetails';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import MyApplications from '../pages/candidate/MyApplications';
import CandidateProfile from '../pages/candidate/CandidateProfile';
import ResumeUpload from '../pages/candidate/ResumeUpload';

// Recruiter Pages
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import CompanyManagement from '../pages/recruiter/CompanyManagement';
import JobManagement from '../pages/recruiter/JobManagement';
import CreateJob from '../pages/recruiter/CreateJob';
import ApplicantsManagement from '../pages/recruiter/ApplicantsManagement';
import RecruiterProfile from '../pages/recruiter/RecruiterProfile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes under Guest Layout */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>

      {/* Candidate Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
        <Route element={<CandidateLayout />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/applications" element={<MyApplications />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/resume" element={<ResumeUpload />} />
        </Route>
      </Route>

      {/* Recruiter Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/companies" element={<CompanyManagement />} />
          <Route path="/recruiter/jobs" element={<JobManagement />} />
          <Route path="/recruiter/create-job" element={<CreateJob />} />
          <Route path="/recruiter/edit-job/:id" element={<CreateJob />} />
          <Route path="/recruiter/applications" element={<ApplicantsManagement />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
        </Route>
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
