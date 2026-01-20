import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Navigation Bar Component
 * Provides navigation across different pages based on auth role
 */
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-primary-700 text-white'
      : 'text-gray-300 hover:bg-primary-600 hover:text-white';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-800 shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to={user?.role === 'admin' ? "/" : "/map"} className="flex items-center">
              <span className="text-white text-xl font-bold">
                🏥 HackX {user?.role === 'admin' ? 'Dashboard' : 'Map'}
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                      '/'
                    )}`}
                  >
                    Dashboard
                  </Link>
                )}
                
                <Link
                  to="/map"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                    '/map'
                  )}`}
                >
                  Map View
                </Link>

                <div className="ml-4 flex items-center space-x-3 border-l border-primary-700 pl-4">
                  <span className="text-sm text-gray-300">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-200 hover:bg-red-900 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                    '/login'
                  )}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                    '/register'
                  )}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
