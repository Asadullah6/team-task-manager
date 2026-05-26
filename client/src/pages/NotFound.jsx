// client/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center p-4">
    <div>
      <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
      <p className="text-slate-500 mb-6">Page not found</p>
      <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
