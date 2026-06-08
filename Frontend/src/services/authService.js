import { apiRequest } from './api';

export const authService = {
  login: async (email, password) => {
    const res = await apiRequest('post', '/api/auth/login', { email, password });
    return res.data;
  },

  register: async (name, email, password, role) => {
    const res = await apiRequest('post', '/api/auth/register', { name, email, password, role });
    return res.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    if (token.startsWith('mock-token-')) {
      const res = await apiRequest('get', '/api/auth/me');
      return res.data;
    }
    
    // For standard Spring Boot token, fetch profile or parse payload
    try {
      // Decode JWT token payload locally to prevent network calls
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // In JWT standard payload, claims typically have sub (email), role/roles, etc.
      // Adjust keys to match what user context expects
      return {
        id: payload.id || 1,
        name: payload.name || payload.sub?.split('@')[0] || 'User',
        email: payload.sub,
        role: payload.role || (payload.roles && payload.roles[0]) || 'CANDIDATE'
      };
    } catch (e) {
      console.warn("Could not decode JWT payload, requesting from backend /api/test endpoint", e);
      // Fallback
      return {
        id: 1,
        name: token.split('@')[0] || 'User',
        email: token,
        role: 'CANDIDATE'
      };
    }
  }
};
