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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-success-50/30">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent mb-2">
              Public Health & Urban Risk Dashboard
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
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
              className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all duration-200"
            >
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Server Status Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔌</span>
            Server Status
          </h2>

          {loading && (
            <div className="flex items-center text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-3"></div>
              Checking server connection...
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-risk-50 to-warning-50 border-l-4 border-risk-500 text-risk-700 px-4 py-3 rounded-lg">
              <p className="font-medium flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Connection Error
              </p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {serverStatus && !loading && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center bg-success-50 px-4 py-2 rounded-lg border border-success-200">
                <span className="inline-block w-3 h-3 bg-success-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-gray-700">
                  <strong className="text-success-700">Status:</strong> {serverStatus.status}
                </span>
              </div>
              <div className="text-gray-700 bg-primary-50 px-4 py-2 rounded-lg border border-primary-200">
                <strong className="text-primary-700">Env:</strong> {serverStatus.environment}
              </div>
              <div className="text-gray-700 bg-analytics-50 px-4 py-2 rounded-lg border border-analytics-200">
                <strong className="text-analytics-700">DB:</strong> {serverStatus.database}
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
          color="risk"
          icon="🏥"
        />
        <StatCard
          title="Active Complaints"
          value={kpiData.activeSanitationComplaints}
          subtitle="Sanitation issues pending"
          color="warning"
          icon="🚨"
        />
        <StatCard
          title="High-Risk Areas"
          value={kpiData.highRiskAreas}
          subtitle="Require immediate attention"
          color="analytics"
          icon="⚠️"
        />
        <StatCard
          title="Avg City PM2.5"
          value={kpiData.avgCityPM25 !== null ? `${kpiData.avgCityPM25} µg/m³` : 'N/A'}
          subtitle={kpiData.avgCityPM25 > 100 ? 'Unhealthy levels' : 'Acceptable levels'}
          color={kpiData.avgCityPM25 > 100 ? 'risk' : 'success'}
          icon="🌫️"
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🚮</span>
              Sanitation Issues in {selectedArea}
            </h3>
            {breakdownData.complaints.length > 0 ? (
              <div className="space-y-3">
                {breakdownData.complaints.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-warning-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-warning-200">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="bg-gradient-to-r from-warning-500 to-warning-400 text-white py-1.5 px-4 rounded-full text-sm font-semibold shadow-sm">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic py-4 text-center">No sanitation complaints reported.</p>
            )}
          </div>

          {/* Disease Type Breakdown */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🦠</span>
              Reported Diseases in {selectedArea}
            </h3>
            {breakdownData.diseases.length > 0 ? (
              <div className="space-y-3">
                {breakdownData.diseases.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-risk-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-risk-200">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="bg-gradient-to-r from-risk-500 to-risk-400 text-white py-1.5 px-4 rounded-full text-sm font-semibold shadow-sm">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic py-4 text-center">No health incidents reported.</p>
            )}
          </div>
        </div>
      )}

      {/* Insights Panel */}
      <div className="mb-8">
        <InsightsPanel selectedArea={selectedArea} />
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-br from-primary-50 to-success-50 rounded-xl shadow-lg border border-primary-200 p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          Phase 1-5 Complete
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-success-600 mr-2 text-lg">✓</span>
              <span>Backend API server with Express & MongoDB</span>
            </li>
            <li className="flex items-start">
              <span className="text-success-600 mr-2 text-lg">✓</span>
              <span>Database models for Health, Sanitation, and Environment</span>
            </li>
            <li className="flex items-start">
              <span className="text-success-600 mr-2 text-lg">✓</span>
              <span>React frontend with Vite and Tailwind CSS</span>
            </li>
          </ul>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-success-600 mr-2 text-lg">✓</span>
              <span>REST APIs with area-wise risk assessment</span>
            </li>
            <li className="flex items-start">
              <span className="text-success-600 mr-2 text-lg">✓</span>
              <span>Interactive Leaflet map with risk visualization</span>
            </li>
            <li className="flex items-start">
              <span className="text-success-600 mr-2 text-lg">✓</span>
              <span>KPI cards, trend charts, and intelligent insights</span>
            </li>
          </ul>
        </div>
        <div className="mt-6 pt-4 border-t border-primary-300">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Click <strong className="text-primary-700">Map View</strong> in the navigation to see the interactive risk map.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
