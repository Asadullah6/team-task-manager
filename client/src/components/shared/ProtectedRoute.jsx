// client/src/components/shared/ProtectedRoute.jsx
// Wrap any page with this to block logged-out users
// If not logged in → redirects to /login automatically
// Usage in App.jsx: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking session, show a spinner so the page doesn't flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
