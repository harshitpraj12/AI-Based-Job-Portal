import { apiRequest } from './api';

export const applicationService = {
  applyJob: async (jobId) => {
    const res = await apiRequest('post', '/api/applications/apply', { jobId });
    return res.data;
  },

  getMyApplications: async () => {
    const res = await apiRequest('get', '/api/applications/my-applications');
    return res.data;
  },

  getAllApplications: async () => {
    const res = await apiRequest('get', '/api/applications/job/all-job');
    return res.data;
  },

  updateStatus: async (applicationId, status) => {
    // status values: 'APPLIED', 'SHORTLISTED', 'REJECTED', 'HIRED'
    const res = await apiRequest('put', `/api/applications/job/${applicationId}/status`, { status });
    return res.data;
  },

  uploadResume: async (file) => {
    const token = localStorage.getItem('token');
    const useMock = token ? token.startsWith('mock-token-') : false;

    // Resolve candidate ID
    let candidateId = 'me';
    if (token) {
      if (token.startsWith('mock-token-')) {
        const email = token.replace('mock-token-', '');
        const usersData = localStorage.getItem('mock_users');
        if (usersData) {
          try {
            const users = JSON.parse(usersData);
            const u = users.find(u => u.email === email);
            if (u) candidateId = u.id;
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        // Decode JWT token payload locally to find ID
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          if (payload && payload.id) candidateId = payload.id;
        } catch (e) {
          console.warn("Could not decode JWT payload to find ID", e);
        }
      }
    }

    if (useMock) {
      // In mock mode, we convert the file to a base64 DataURL and save it to localStorage
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const mockResume = {
            fileName: file.name,
            uploadDate: new Date().toISOString(),
            candidateId: candidateId,
            fileData: reader.result
          };
          localStorage.setItem(`mock_resume_${candidateId}`, JSON.stringify(mockResume));
          resolve({ data: 'Resume uploaded successfully' });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await apiRequest('post', '/api/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Save metadata locally so candidate page knows they have an uploaded file
    localStorage.setItem(`mock_resume_${candidateId}`, JSON.stringify({
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      candidateId: candidateId
    }));

    return res.data;
  },

  getResumeMetadata: async (candidateId) => {
    const token = localStorage.getItem('token');
    const useMock = token ? token.startsWith('mock-token-') : false;

    if (useMock) {
      // Return mock data from local storage
      const cached = localStorage.getItem(`mock_resume_${candidateId || 'me'}`);
      if (cached) return JSON.parse(cached);
      return null;
    }

    try {
      const res = await apiRequest('get', `/api/resumes/metadata/${candidateId || 'me'}`);
      return res.data;
    } catch (error) {
      console.warn("Failed to get resume metadata from backend", error);
      return null;
    }
  },

  downloadResume: async (candidateId) => {
    const token = localStorage.getItem('token');
    const useMock = token ? token.startsWith('mock-token-') : false;

    if (useMock) {
      const cached = localStorage.getItem(`mock_resume_${candidateId}`);
      const resumeName = cached ? JSON.parse(cached).fileName : 'resume_jane_doe.pdf';
      const parsed = cached ? JSON.parse(cached) : null;

      if (parsed && parsed.fileData) {
        try {
          const parts = parsed.fileData.split(',');
          const base64Data = parts[1] || parts[0];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          return { blob, fileName: resumeName };
        } catch (e) {
          console.error("Failed to decode saved base64 resume file", e);
        }
      }

      // Fallback: build a rich mock CV file as text
      const profileCached = localStorage.getItem(`profile_${candidateId}`);
      let content = `=======================================\n`;
      content += `          MOCK RESUME DOCUMENT         \n`;
      content += `=======================================\n\n`;
      if (profileCached) {
        const prof = JSON.parse(profileCached);
        content += `Contact Phone: ${prof.phone || 'N/A'}\n`;
        content += `LinkedIn: ${prof.linkedin || 'N/A'}\n`;
        content += `GitHub: ${prof.github || 'N/A'}\n\n`;
        content += `Education History:\n`;
        if (Array.isArray(prof.education)) {
          prof.education.forEach(edu => {
            content += `- ${edu.degree} at ${edu.school} (${edu.startYear} - ${edu.endYear})\n`;
          });
        } else {
          content += `- ${prof.education}\n`;
        }
        content += `\nProfessional Experience:\n${prof.experience || 'N/A'}\n\n`;
        content += `Skills:\n${Array.isArray(prof.skills) ? prof.skills.join(', ') : 'N/A'}\n`;
      } else {
        content += `Candidate ID: ${candidateId}\nNo profile details found in mock database.`;
      }

      const blob = new Blob([content], { type: 'text/plain' });
      return { blob, fileName: resumeName };
    }

    const response = await apiRequest('get', `/api/resumes/download/${candidateId}`, null, {
      responseType: 'blob'
    });

    let fileName = 'resume.pdf';
    const contentDisposition = response.headers && response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) fileName = match[1];
    }
    return { blob: response.data, fileName };
  }
};
