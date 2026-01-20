import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import StatCard from '../components/StatCard';
import SanitationTrendChart from '../components/SanitationTrendChart';
import AirQualityTrendChart from '../components/AirQualityTrendChart';
import InsightsPanel from '../components/InsightsPanel';

/**
 * Dashboard Page
 * Main landing page showing overview and server status
 */
function Dashboard() {
  const [serverStatus, setServerStatus] = useState(null);
  const [kpiData, setKpiData] = useState({
    totalHealthIncidents: 0,
    activeSanitationComplaints: 0,
    highRiskAreas: 0,
    avgCityPM25: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch server health status on component mount
  useEffect(() => {
    fetchServerStatus();
    fetchKPIData();
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

  const fetchKPIData = async () => {
    try {
      // Fetch all data in parallel
      const [healthResponse, sanitationResponse, areaSummaryResponse, envDataResponse] = await Promise.all([
        apiService.getHealthIncidents(),
        apiService.getSanitationComplaints(),
        apiService.getAreaSummary(),
        apiService.getEnvironmentalData()
      ]);

      // Calculate KPIs
      const totalHealthIncidents = healthResponse.count;
      const activeSanitationComplaints = sanitationResponse.data.filter(
        c => c.status === 'open' || c.status === 'in-progress'
      ).length;
      const highRiskAreas = areaSummaryResponse.data.filter(
        area => area.riskLevel === 'HIGH'
      ).length;

      // Calculate average city PM2.5
      const airData = envDataResponse.data.filter(d => d.type === 'air' && d.pm25);
      const avgCityPM25 = airData.length > 0
        ? parseFloat((airData.reduce((sum, d) => sum + d.pm25, 0) / airData.length).toFixed(1))
        : null;

      setKpiData({
        totalHealthIncidents,
        activeSanitationComplaints,
        highRiskAreas,
        avgCityPM25
      });
    } catch (err) {
      console.error('Error fetching KPI data:', err);
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Health Incidents"
          value={kpiData.totalHealthIncidents}
          subtitle="Reported cases"
          color="red"
        />
        <StatCard
          title="Active Complaints"
          value={kpiData.activeSanitationComplaints}
          subtitle="Sanitation issues pending"
          color="orange"
        />
        <StatCard
          title="High-Risk Areas"
          value={kpiData.highRiskAreas}
          subtitle="Require immediate attention"
          color="purple"
        />
        <StatCard
          title="Avg City PM2.5"
          value={kpiData.avgCityPM25 !== null ? `${kpiData.avgCityPM25} µg/m³` : 'N/A'}
          subtitle={kpiData.avgCityPM25 > 100 ? 'Unhealthy levels' : 'Acceptable levels'}
          color={kpiData.avgCityPM25 > 100 ? 'red' : 'green'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SanitationTrendChart />
        <AirQualityTrendChart />
      </div>

      {/* Insights Panel */}
      <div className="mb-8">
        <InsightsPanel />
      </div>

      {/* Info Section */}
      <div className="card bg-blue-50 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Phase 1-5 Complete
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
            REST APIs with area-wise risk assessment
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Interactive Leaflet map with risk visualization
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            KPI cards, trend charts, and intelligent insights
          </li>
        </ul>
        <div className="mt-4 pt-4 border-t border-blue-300">
          <p className="text-sm text-gray-600">
            Click <strong>Map View</strong> in the navigation to see the interactive risk map.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
