import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiService } from '../services/api';

/**
 * RiskMap Component
 * Interactive map showing area-wise risk levels for Pune city
 */
function RiskMap() {
  const [areaSummaryData, setAreaSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pune city center coordinates
  const puneCenter = [18.5204, 73.8567];
  const zoomLevel = 12;

  // Fetch area summary data on component mount
  useEffect(() => {
    fetchAreaSummary();
  }, []);

  const fetchAreaSummary = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAreaSummary();
      setAreaSummaryData(data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load area summary data');
      console.error('Error fetching area summary:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get marker color based on risk level
   * @param {string} riskLevel - HIGH, MEDIUM, or LOW
   * @returns {string} - Color code
   */
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return '#ef4444'; // Red
      case 'MEDIUM':
        return '#f97316'; // Orange
      case 'LOW':
        return '#22c55e'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  /**
   * Get marker radius based on risk level
   * Higher risk = larger marker
   */
  const getMarkerRadius = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return 20;
      case 'MEDIUM':
        return 15;
      case 'LOW':
        return 10;
      default:
        return 10;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">⚠️ {error}</p>
        <button
          onClick={fetchAreaSummary}
          className="mt-3 btn-secondary text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Map Legend */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Risk Level Legend</h3>
        <div className="flex gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-600">High Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="rounded-lg overflow-hidden shadow-lg" style={{ height: '500px' }}>
        <MapContainer
          center={puneCenter}
          zoom={zoomLevel}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Area Risk Markers */}
          {areaSummaryData.map((area, index) => {
            // Extract first location from the area (we'll use a simple approach)
            // In a real app, you might want to store area center coordinates separately
            const lat = area.location?.lat || puneCenter[0];
            const lng = area.location?.lng || puneCenter[1];

            return (
              <CircleMarker
                key={index}
                center={[lat, lng]}
                radius={getMarkerRadius(area.riskLevel)}
                fillColor={getRiskColor(area.riskLevel)}
                color={getRiskColor(area.riskLevel)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                      {area.area}
                    </h3>
                    
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          area.riskLevel === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : area.riskLevel === 'MEDIUM'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {area.riskLevel} RISK
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Health Incidents:</span>
                        <span className="font-semibold text-gray-800">
                          {area.healthIncidentCount}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sanitation Complaints:</span>
                        <span className="font-semibold text-gray-800">
                          {area.sanitationComplaintCount}
                        </span>
                      </div>
                      
                      {area.avgPM25 !== null && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg PM2.5:</span>
                          <span className="font-semibold text-gray-800">
                            {area.avgPM25} µg/m³
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Areas Monitored</p>
          <p className="text-2xl font-bold text-gray-800">{areaSummaryData.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">High Risk Areas</p>
          <p className="text-2xl font-bold text-red-600">
            {areaSummaryData.filter(a => a.riskLevel === 'HIGH').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Medium Risk Areas</p>
          <p className="text-2xl font-bold text-orange-600">
            {areaSummaryData.filter(a => a.riskLevel === 'MEDIUM').length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RiskMap;
