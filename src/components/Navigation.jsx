import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          Task Tracker
        </Link>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}