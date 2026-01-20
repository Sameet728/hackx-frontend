import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation Bar Component
 * Provides navigation across different pages
 */
function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-primary-700 text-white'
      : 'text-gray-300 hover:bg-primary-600 hover:text-white';
  };

  return (
    <nav className="bg-primary-800 shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">
                🏥 HackX Dashboard
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                '/'
              )}`}
            >
              Dashboard
            </Link>
            <Link
              to="/map"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                '/map'
              )}`}
            >
              Map View
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
