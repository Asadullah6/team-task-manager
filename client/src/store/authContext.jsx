// client/src/store/authContext.jsx
// React Context that stores the logged-in user globally
// Wrap your whole app in <AuthProvider> so every component can access it
// Use the useAuth() hook (in hooks/useAuth.js) to read it

import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking if already logged in

  // On page load, check if the user already has a session (e.g. they refreshed the page)
  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))  // not logged in — that's fine
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
