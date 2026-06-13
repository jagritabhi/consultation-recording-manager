import axios from 'axios';
import { getToken, clearToken } from './auth';

// Create custom axios instance
const api = axios.create({
  baseURL: '/api' // Proxied by Vite server in development
});

// Request interceptor to automatically add Authorization JWT headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth failures (like expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear token and redirect to login
    if (error.response && error.response.status === 401) {
      clearToken();
      // Only redirect if not already on the login page to avoid redirect loops
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
