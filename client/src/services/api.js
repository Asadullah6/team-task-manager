// client/src/services/api.js
// One shared axios instance used by all service files
// withCredentials: true means cookies (session) are sent with every request

import axios from 'axios';

const api = axios.create({
  baseURL: '/',           // Vite proxy forwards /api/* to localhost:5000
  withCredentials: true,  // IMPORTANT: sends the session cookie with every request
  headers: { 'Content-Type': 'application/json' },
});

// If the server returns 401 (not logged in), redirect to login page automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
