import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiService } from '../services/api';

/**
 * AirQualityTrendChart Component
 * Shows PM2.5 levels over time
 */
function AirQualityTrendChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnvironmentalData();
  }, []);

  const fetchEnvironmentalData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEnvironmentalData();
      
      // Filter only air quality data and format for chart
      const airData = response.data
        .filter(item => item.type === 'air')
        .map(item => ({
          date: new Date(item.recordedDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          area: item.area,
          pm25: item.pm25,
          pm10: item.pm10,
          timestamp: new Date(item.recordedDate).getTime()
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      setChartData(airData);
      setError(null);
    } catch (err) {
      setError('Failed to load air quality trend data');
      console.error('Error fetching environmental data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Air Quality Trend (PM2.5 & PM10)
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'µg/m³', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pm25" 
            stroke="#8b5cf6" 
            name="PM2.5"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="pm10" 
            stroke="#3b82f6" 
            name="PM10"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Reference:</strong> PM2.5 above 100 µg/m³ is considered unhealthy, above 150 is very unhealthy
        </p>
      </div>
    </div>
  );
}

export default AirQualityTrendChart;
