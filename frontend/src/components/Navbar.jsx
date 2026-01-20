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
      ? 'bg-primary-700 text-white shadow-lg scale-105'
      : 'text-primary-100 hover:bg-primary-700/70 hover:text-white';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 shadow-xl border-b border-primary-500">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to={user?.role === 'admin' ? "/" : "/map"} className="flex items-center gap-3 group">
              <div className="bg-white p-2 rounded-xl shadow-health group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-2xl" role="img" aria-label="Hospital">🏥</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-2xl font-bold tracking-tight">HackX</span>
                <span className="text-primary-200 text-xs font-medium">Health Monitoring</span>
              </div>
              <span className="ml-2 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                {user?.role === 'admin' ? 'Dashboard' : 'Map'}
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/"
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive(
                      '/'
                    )}`}
                  >
                    📊 Overview
                  </Link>
                )}
                
                <Link
                  to="/map"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive(
                    '/map'
                  )}`}
                >
                  🗺️ Map View
                </Link>

                <div className="ml-4 flex items-center space-x-3 border-l border-primary-500 pl-4">
                  <div className="hidden md:flex flex-col items-end bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white">
                      {user.name}
                    </span>
                    <span className="text-xs text-primary-200 capitalize font-medium">
                      {user.role}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-lg text-white bg-risk-600 hover:bg-risk-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    title="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive(
                    '/login'
                  )}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 ${isActive(
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
