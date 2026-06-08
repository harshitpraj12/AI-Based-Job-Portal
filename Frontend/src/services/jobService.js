import { apiRequest } from './api';

export const jobService = {
  getAllJobs: async () => {
    const res = await apiRequest('get', '/api/jobs');
    return res.data;
  },

  getJobById: async (id) => {
    const res = await apiRequest('get', `/api/jobs/${id}`);
    return res.data;
  },

  createJob: async (jobData) => {
    // jobData expected: { title, description, location, salary, experience, skillsRequires, companyId }
    const res = await apiRequest('post', '/api/jobs', jobData);
    return res.data;
  },

  updateJob: async (id, jobData) => {
    const res = await apiRequest('put', `/api/jobs/${id}`, jobData);
    return res.data;
  }
};
