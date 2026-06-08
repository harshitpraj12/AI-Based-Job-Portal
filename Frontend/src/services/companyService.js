import { apiRequest } from './api';

export const companyService = {
  getAllCompanies: async () => {
    const res = await apiRequest('get', '/api/companies');
    return res.data;
  },

  createCompany: async (companyData) => {
    // companyData expected: { companyName, website, location, description }
    const res = await apiRequest('post', '/api/companies', companyData);
    return res.data;
  },

  updateCompany: async (id, companyData) => {
    const res = await apiRequest('put', `/api/companies/${id}`, companyData);
    return res.data;
  }
};
