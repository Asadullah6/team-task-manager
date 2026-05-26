// client/src/components/shared/Navbar.jsx
// Top navigation bar — shows user name and logout button

import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { logoutUser } from '../../services/authService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();           // clear user from context
      navigate('/login'); // redirect to login page
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Logo / App name */}
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">TM</span>
        </div>
        <span className="font-semibold text-slate-800 text-lg">TaskManager</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Show logged-in user's name */}
        <span className="text-slate-600 text-sm">
          👤 <span className="font-medium">{user?.name}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
