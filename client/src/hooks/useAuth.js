// client/src/hooks/useAuth.js
// Simple hook — call this in any component to get the logged-in user
// Example: const { user, login, logout } = useAuth();

import { useContext } from 'react';
import { AuthContext } from '../store/authContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
};

export default useAuth;
