import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !token.startsWith('mock-token')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// MOCK DATA SYSTEM (Fallback for when Spring Boot backend is offline)
const MOCK_DELAY = 400;

const getMockData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const saveMockData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial Mock Data
const INITIAL_COMPANIES = [
  { id: 1, companyName: 'Notion Labs', website: 'https://notion.so', location: 'San Francisco, CA', description: 'Notion is a single space where you can think, write, and plan. Capture thoughts, manage projects, or even run an entire company — and customize it exactly how you want.' },
  { id: 2, companyName: 'Linear App', website: 'https://linear.app', location: 'Remote / NYC', description: 'Linear helps software teams streamline projects, tasks, bugs, and product roadmaps. It is built for high-performance teams.' },
  { id: 3, companyName: 'Vercel', website: 'https://vercel.com', location: 'Remote', description: 'Vercel provides the developer experience and infrastructure to build, deploy, and scale frontend applications.' },
  { id: 4, companyName: 'Stripe', website: 'https://stripe.com', location: 'San Francisco, CA', description: 'Stripe is a suite of APIs powering-online payment processing and commerce solutions for businesses of all sizes.' }
];

const INITIAL_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer (React/Tailwind)', companyId: 2, companyName: 'Linear App', location: 'Remote (US/EU)', salary: '$140,000 - $180,000', experience: 5, skillsRequires: 'React, Tailwind CSS, TypeScript, Framer Motion', description: 'We are looking for a Senior Frontend Engineer to build beautiful, fast, and keyboard-accessible web experiences. You will own client development from spec to deploy, focusing on micro-interactions, responsive design, and performance optimizations.' },
  { id: 2, title: 'Product Designer', companyId: 1, companyName: 'Notion Labs', location: 'San Francisco, CA', experience: 3, salary: '$120,000 - $150,000', skillsRequires: 'Figma, Design Systems, Prototyping, HTML/CSS', description: 'Join our product design team to craft intuitive workflows for Notion projects, docs, and databases. We value extreme attention to detail, typography, and interactive prototyping skills.' },
  { id: 3, title: 'Staff Full Stack Developer', companyId: 3, companyName: 'Vercel', location: 'Remote', experience: 8, salary: '$180,000 - $220,000', skillsRequires: 'React, Next.js, Node.js, PostgreSQL, AWS', description: 'Scale Vercel\'s core deployment infrastructure and developer dashboard. Lead architectural designs for modern serverless apps and optimize build speeds.' },
  { id: 4, title: 'Technical Product Manager', companyId: 4, companyName: 'Stripe', location: 'Dublin, IE / Hybrid', experience: 4, salary: '$130,000 - $165,000', skillsRequires: 'APIs, Billing Systems, Analytics, SQL', description: 'Work on Stripe Billing APIs to make subscription logic extremely simple for millions of SaaS startups. Define product requirements, outline API specifications, and coordinate across engineers and growth teams.' }
];

const INITIAL_APPLICATIONS = [
  { id: 1, jobId: 1, jobTitle: 'Senior Frontend Engineer (React/Tailwind)', companyName: 'Linear App', candidateId: 2, candidateName: 'Jane Doe', appliedAt: '2026-06-01T10:00:00Z', status: 'SHORTLISTED' },
  { id: 2, jobId: 2, jobTitle: 'Product Designer', companyName: 'Notion Labs', candidateId: 2, candidateName: 'Jane Doe', appliedAt: '2026-06-03T14:30:00Z', status: 'APPLIED' }
];

const INITIAL_USERS = [
  { id: 1, name: 'Alex Recruiter', email: 'recruiter@jobportal.com', password: 'password', role: 'RECRUITER' },
  { id: 2, name: 'Jane Doe', email: 'candidate@jobportal.com', password: 'password', role: 'CANDIDATE' }
];

// Pre-populate Jane Doe's mock resume if not present
if (typeof window !== 'undefined' && !localStorage.getItem('mock_resume_2')) {
  localStorage.setItem('mock_resume_2', JSON.stringify({
    fileName: 'resume_jane_doe.pdf',
    uploadDate: '2026-06-01T10:00:00Z',
    candidateId: 2,
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcOlwrHDgwoxIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDQgMCBSCj4+Cj4+Ci9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL0VuY29kaW5nIC9XaW5Bc2lpRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCA4MAo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKEphbmUgRG9lIC0gUHJvZmVzc2lvbmFsIENWKSBUagpldAppbnRyb2R1Y3Rpb24gQ1YKZXQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2OCAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIGYgCjAwMDAwMDAyNjYgMDAwMDAgbiAKMDAwMDAwMDM2NiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ5OQolJUVPRgo='
  }));
}

// Helper to delay response
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockRequest = async (method, url, data = null) => {
  await delay(MOCK_DELAY);

  const companies = getMockData('mock_companies', INITIAL_COMPANIES);
  const jobs = getMockData('mock_jobs', INITIAL_JOBS);
  const applications = getMockData('mock_applications', INITIAL_APPLICATIONS);
  const users = getMockData('mock_users', INITIAL_USERS);
  const token = localStorage.getItem('token');

  // Helper to extract current user from token
  const getCurrentMockUser = () => {
    if (!token) return null;
    const email = token.replace('mock-token-', '');
    return users.find(u => u.email === email) || null;
  };

  // 1. Auth Endpoint Matches
  if (url === '/api/auth/login') {
    const { email, password } = data;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw { response: { status: 401, data: { message: 'Invalid email or password' } } };
    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: `mock-token-${user.email}`,
        message: 'Login successful'
      }
    };
  }

  if (url === '/api/auth/register') {
    const { name, email, password, role } = data;
    if (users.some(u => u.email === email)) {
      throw { response: { status: 400, data: { message: 'User already exists' } } };
    }
    const newUser = { id: Date.now(), name, email, password, role };
    users.push(newUser);
    saveMockData('mock_users', users);
    return {
      data: {
        message: 'Registration successful',
        email: newUser.email
      }
    };
  }

  if (url === '/api/auth/me') {
    const user = getCurrentMockUser();
    if (!user) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
    return { data: user };
  }

  // 2. Jobs Endpoint Matches
  if (url === '/api/jobs' && method === 'get') {
    return { data: jobs };
  }

  if (url.startsWith('/api/jobs/') && method === 'get') {
    const id = parseInt(url.split('/').pop());
    const job = jobs.find(j => j.id === id);
    if (!job) throw { response: { status: 404, data: { message: 'Job not found' } } };
    return { data: job };
  }

  if (url === '/api/jobs' && method === 'post') {
    const user = getCurrentMockUser();
    if (user?.role !== 'RECRUITER') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const company = companies.find(c => c.id === data.companyId);
    const newJob = {
      id: Date.now(),
      title: data.title,
      companyId: data.companyId,
      companyName: company ? company.companyName : 'Unknown Company',
      location: data.location,
      salary: data.salary,
      experience: data.experience,
      skillsRequires: data.skillsRequires,
      description: data.description
    };
    jobs.push(newJob);
    saveMockData('mock_jobs', jobs);
    return { data: newJob };
  }

  if (url.startsWith('/api/jobs/') && method === 'put') {
    const user = getCurrentMockUser();
    if (user?.role !== 'RECRUITER') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const id = parseInt(url.split('/').pop());
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) throw { response: { status: 404, data: { message: 'Job not found' } } };

    const company = companies.find(c => c.id === data.companyId);
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      title: data.title,
      companyId: data.companyId,
      companyName: company ? company.companyName : 'Unknown Company',
      location: data.location,
      salary: data.salary,
      experience: data.experience,
      skillsRequires: data.skillsRequires,
      description: data.description
    };
    saveMockData('mock_jobs', jobs);
    return { data: jobs[jobIndex] };
  }

  // 3. Companies Endpoint Matches
  if (url === '/api/companies' && method === 'get') {
    return { data: companies };
  }

  if (url === '/api/companies' && method === 'post') {
    const user = getCurrentMockUser();
    if (user?.role !== 'RECRUITER') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const newCompany = {
      id: Date.now(),
      companyName: data.companyName,
      website: data.website,
      location: data.location,
      description: data.description,
      recruiterId: user.id
    };
    companies.push(newCompany);
    saveMockData('mock_companies', companies);
    return { data: newCompany };
  }

  if (url.startsWith('/api/companies/') && method === 'put') {
    const user = getCurrentMockUser();
    if (user?.role !== 'RECRUITER') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const id = parseInt(url.split('/').pop());
    const compIndex = companies.findIndex(c => c.id === id);
    if (compIndex === -1) throw { response: { status: 404, data: { message: 'Company not found' } } };

    companies[compIndex] = {
      ...companies[compIndex],
      companyName: data.companyName,
      website: data.website,
      location: data.location,
      description: data.description
    };
    saveMockData('mock_companies', companies);
    return { data: companies[compIndex] };
  }

  // 4. Job Applications Endpoints
  if (url === '/api/applications/apply' && method === 'post') {
    const user = getCurrentMockUser();
    if (user?.role !== 'CANDIDATE') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const alreadyApplied = applications.some(a => a.jobId === data.jobId && a.candidateId === user.id);
    if (alreadyApplied) throw { response: { status: 400, data: { message: 'Already Applied' } } };

    const job = jobs.find(j => j.id === data.jobId);
    const newApp = {
      id: Date.now(),
      jobId: data.jobId,
      job: { id: job.id, title: job.title, company: { companyName: job.companyName } }, // Map structure to match Entity
      jobTitle: job ? job.title : 'Job Listing',
      companyName: job ? job.companyName : 'Unknown',
      candidateId: user.id,
      candidate: { id: user.id, name: user.name, email: user.email }, // Map structure to match Entity
      appliedAt: new Date().toISOString(),
      status: 'APPLIED'
    };
    applications.push(newApp);
    saveMockData('mock_applications', applications);
    return { data: 'Job applied Successfully' };
  }

  if (url === '/api/applications/my-applications' && method === 'get') {
    const user = getCurrentMockUser();
    if (user?.role !== 'CANDIDATE') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const candidateApps = applications.filter(a => a.candidateId === user.id);
    return { data: candidateApps };
  }

  if (url === '/api/applications/job/all-job' && method === 'get') {
    const user = getCurrentMockUser();
    if (user?.role !== 'RECRUITER') throw { response: { status: 403, data: { message: 'Access denied' } } };
    return { data: applications };
  }

  if (url.startsWith('/api/applications/jobs/') && method === 'get') {
    const user = getCurrentMockUser();
    if (user?.role !== 'RECRUITER') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const jobId = parseInt(url.split('/').pop());
    const filteredApps = applications.filter(a => a.jobId === jobId || a.job?.id === jobId);

    const dtos = filteredApps.map(app => {
      const cId = app.candidateId || app.candidate?.id;
      const candUser = users.find(u => u.id === cId);
      const email = candUser ? candUser.email : (app.candidate?.email || 'email@jobportal.com');
      const name = candUser ? candUser.name : (app.candidateName || app.candidate?.name || 'Candidate');

      const matchScore = (cId === 2) ? 85 : Math.floor(60 + Math.random() * 35);
      const strengths = (cId === 2) 
        ? "Excellent knowledge of React, Tailwind CSS, TypeScript, and modern UI micro-animations."
        : "Good command of programming fundamentals and frontend layout structuring.";
      const missingSkills = (cId === 2)
        ? "Docker, Node.js backend optimization."
        : "Next.js, Framer Motion, TypeScript typing rules.";
      const suggestions = (cId === 2)
        ? "Build a backend microservice using Node.js to complement frontend proficiency."
        : "Implement a project utilizing Framer Motion and TypeScript to learn advanced transitions.";

      return {
        id: app.id,
        candidateId: cId,
        candidateName: name,
        email: email,
        status: app.status,
        matchScore: matchScore,
        strengths: strengths,
        missingSkills: missingSkills,
        suggestions: suggestions
      };
    });

    return { data: dtos };
  }

  if (url.startsWith('/api/applications/job/') && method === 'get') {
    const id = parseInt(url.split('/').pop());
    const app = applications.find(a => a.id === id);
    if (!app) throw { response: { status: 404, data: { message: 'Application not found' } } };
    return { data: app };
  }

  if (url.includes('/status') && method === 'put') {
    const user = getCurrentMockUser();
    if (user?.role !== 'RECRUITER') throw { response: { status: 403, data: { message: 'Access denied' } } };

    // URL structure: /api/applications/job/{id}/status
    const parts = url.split('/');
    const idIndex = parts.indexOf('job') + 1;
    const id = parseInt(parts[idIndex]);

    const appIndex = applications.findIndex(a => a.id === id);
    if (appIndex === -1) throw { response: { status: 404, data: { message: 'Application not found' } } };

    applications[appIndex].status = data.status;
    saveMockData('mock_applications', applications);
    return { data: applications[appIndex] };
  }

  // 5. Resume upload
  if (url === '/api/resumes/upload' && method === 'post') {
    const user = getCurrentMockUser();
    if (user?.role !== 'CANDIDATE') throw { response: { status: 403, data: { message: 'Access denied' } } };

    const mockResume = {
      fileName: data.get('file').name,
      uploadDate: new Date().toISOString(),
      candidateId: user.id
    };
    localStorage.setItem(`mock_resume_${user.id}`, JSON.stringify(mockResume));
    return { data: 'Resume uploaded successfully' };
  }

  throw { response: { status: 404, data: { message: 'Mock endpoint not found' } } };
};

// Wrapper API request method to handle backend connection + fallback to mock
export const apiRequest = async (method, url, data = null, options = {}) => {
  const token = localStorage.getItem('token');
  const useMock = token ? token.startsWith('mock-token-') : false;

  if (useMock) {
    try {
      return await mockRequest(method, url, data);
    } catch (mockErr) {
      throw mockErr;
    }
  }

  try {
    const response = await api({ method, url, data, ...options });
    return response;
  } catch (error) {
    // If backend is down (network error), fall back to Mocking
    if (!error.response || error.code === 'ERR_NETWORK') {
      console.warn("Backend server offline. Falling back to frontend mock database.", error);
      // Migrate client to mock session
      const mockEmail = token && token.includes('@') ? token : 'candidate@jobportal.com';
      localStorage.setItem('token', `mock-token-${mockEmail}`);
      return await mockRequest(method, url, data);
    }
    throw error;
  }
};
