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
  const [selectedArea, setSelectedArea] = useState('All');
  const [areas, setAreas] = useState([]);
  const [rawData, setRawData] = useState(null);
  const [kpiData, setKpiData] = useState({
    totalHealthIncidents: 0,
    activeSanitationComplaints: 0,
    highRiskAreas: 0,
    avgCityPM25: null
  });
  const [breakdownData, setBreakdownData] = useState({
    diseases: [],
    complaints: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update KPIs when data or selected area changes
  useEffect(() => {
    if (!rawData) return;
    calculateKPIs();
  }, [selectedArea, rawData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch Server Status
      try {
        const status = await apiService.getHealthStatus();
        setServerStatus(status);
      } catch (e) {
        console.error("Server status check failed");
      }
      
      // Fetch all core data in parallel
      const [healthResponse, sanitationResponse, areaSummaryResponse, envDataResponse] = await Promise.all([
        apiService.getHealthIncidents(),
        apiService.getSanitationComplaints(),
        apiService.getAreaSummary(),
        apiService.getEnvironmentalData()
      ]);

      setRawData({
        healthData: healthResponse.data,
        sanitationData: sanitationResponse.data,
        areaData: areaSummaryResponse.data,
        envData: envDataResponse.data
      });

      // Extract unique areas for filter
      const uniqueAreas = [...new Set(areaSummaryResponse.data.map(a => a.area))].sort();
      setAreas(['All', ...uniqueAreas]);

      setError(null);
    } catch (err) {
      setError('Failed to connect to server. Please ensure the backend is running.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateKPIs = () => {
    let { healthData, sanitationData, areaData, envData } = rawData;

    // Apply Filter if Area Selected
    if (selectedArea !== 'All') {
      healthData = healthData.filter(d => d.area === selectedArea);
      sanitationData = sanitationData.filter(d => d.area === selectedArea);
      areaData = areaData.filter(d => d.area === selectedArea);
      envData = envData.filter(d => d.area === selectedArea);
    }

    // Calculate KPIs
    const totalHealthIncidents = healthData.length;
    
    const activeSanitationComplaints = sanitationData.filter(
      c => c.status === 'open' || c.status === 'in-progress'
    ).length;
    
    const highRiskAreas = areaData.filter(
      area => area.riskLevel === 'HIGH'
    ).length;

    // Calculate average city PM2.5
    const airData = envData.filter(d => d.type === 'air' && d.pm25);
    const avgCityPM25 = airData.length > 0
      ? parseFloat((airData.reduce((sum, d) => sum + d.pm25, 0) / airData.length).toFixed(1))
      : null;

    setKpiData({
      totalHealthIncidents,
      activeSanitationComplaints,
      highRiskAreas,
      avgCityPM25
    });

    // Calculate Categorical Breakdowns
    const diseaseCounts = {};
    healthData.forEach(d => {
        const type = d.diseaseType || 'Other';
        diseaseCounts[type] = (diseaseCounts[type] || 0) + 1;
    });

    const complaintCounts = {};
    sanitationData.forEach(d => {
        const type = d.category || 'Other';
        complaintCounts[type] = (complaintCounts[type] || 0) + 1;
    });

    setBreakdownData({
        diseases: Object.entries(diseaseCounts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count),
        complaints: Object.entries(complaintCounts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count)
    });
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Public Health & Urban Risk Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time monitoring of health incidents, sanitation complaints, and environmental data
          </p>
        </div>

        {/* Area Filter */}
        <div className="min-w-[200px]">
          <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Area
          </label>
          <select
            id="area-filter"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
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
          </div>
        )}

        {serverStatus && !loading && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-700">
                <strong>Status:</strong> {serverStatus.status}
              </span>
            </div>
            <div className="text-gray-700">
              <strong>Env:</strong> {serverStatus.environment}
            </div>
            <div className="text-gray-700">
              <strong>DB:</strong> {serverStatus.database}
            </div>
          </div>
        )}
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
        <SanitationTrendChart selectedArea={selectedArea} />
        <AirQualityTrendChart selectedArea={selectedArea} />
      </div>

      {/* Detailed Breakdown Section */}
      {selectedArea !== 'All' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sanitation Complaints Type Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sanitation Issues in {selectedArea}
            </h3>
            {breakdownData.complaints.length > 0 ? (
              <div className="space-y-3">
                {breakdownData.complaints.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="bg-orange-100 text-orange-800 py-1 px-3 rounded-full text-sm font-semibold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No sanitation complaints reported.</p>
            )}
          </div>

          {/* Disease Type Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Reported Diseases in {selectedArea}
            </h3>
            {breakdownData.diseases.length > 0 ? (
              <div className="space-y-3">
                {breakdownData.diseases.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm font-semibold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No health incidents reported.</p>
            )}
          </div>
        </div>
      )}

      {/* Insights Panel */}
      <div className="mb-8">
        <InsightsPanel selectedArea={selectedArea} />
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
