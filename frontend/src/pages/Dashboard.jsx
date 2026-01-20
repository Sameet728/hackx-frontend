import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

/**
 * Dashboard Page
 * Main landing page showing overview and server status
 */
function Dashboard() {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch server health status on component mount
  useEffect(() => {
    fetchServerStatus();
  }, []);

  const fetchServerStatus = async () => {
    try {
      setLoading(true);
      const data = await apiService.getHealthStatus();
      setServerStatus(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to server. Please ensure the backend is running.');
      console.error('Error fetching server status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Public Health & Urban Risk Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time monitoring of health incidents, sanitation complaints, and environmental data
        </p>
      </div>

      {/* Server Status Card */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🔌 Server Status
        </h2>

        {loading && (
          <div className="flex items-center text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-3"></div>
            Checking server connection...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="font-medium">⚠️ Connection Error</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchServerStatus}
              className="mt-3 btn-secondary text-sm"
            >
              Retry Connection
            </button>
          </div>
        )}

        {serverStatus && !loading && (
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span className="text-gray-700">
                <strong>Status:</strong> {serverStatus.status}
              </span>
            </div>
            <div className="text-gray-700">
              <strong>Environment:</strong> {serverStatus.environment}
            </div>
            <div className="text-gray-700">
              <strong>Database:</strong> {serverStatus.database}
            </div>
            <div className="text-sm text-gray-500">
              Last checked: {new Date(serverStatus.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Grid - Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Health Incidents
          </h3>
          <p className="text-3xl font-bold text-primary-600">---</p>
          <p className="text-sm text-gray-600 mt-1">Coming in Phase 2</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Sanitation Complaints
          </h3>
          <p className="text-3xl font-bold text-green-600">---</p>
          <p className="text-sm text-gray-600 mt-1">Coming in Phase 2</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Environmental Readings
          </h3>
          <p className="text-3xl font-bold text-purple-600">---</p>
          <p className="text-sm text-gray-600 mt-1">Coming in Phase 2</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="card bg-blue-50 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          📋 Phase 1 Complete
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Backend API server with Express & MongoDB
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Database models for Health, Sanitation, and Environment
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            React frontend with Vite and Tailwind CSS
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Frontend-Backend API integration
          </li>
        </ul>
        <div className="mt-4 pt-4 border-t border-blue-300">
          <p className="text-sm text-gray-600">
            <strong>Next Steps (Phase 2):</strong> Implement CRUD operations, add charts, integrate maps
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
