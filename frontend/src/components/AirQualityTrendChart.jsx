import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiService } from '../services/api';

/**
 * AirQualityTrendChart Component
 * Shows PM2.5 levels by area
 */
function AirQualityTrendChart({ selectedArea }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnvironmentalData();
  }, [selectedArea]);

  const fetchEnvironmentalData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEnvironmentalData();
      
      let data = response.data;
      if (selectedArea && selectedArea !== 'All') {
        data = data.filter(d => d.area === selectedArea);
      }
      
      // Group by area and calculate averages
      const areaMap = {};
      
      data
        .filter(item => item.type === 'air')
        .forEach(item => {
          if (!areaMap[item.area]) {
            areaMap[item.area] = {
              totalPm25: 0,
              totalPm10: 0,
              count: 0
            };
          }
          areaMap[item.area].totalPm25 += (item.pm25 || 0);
          areaMap[item.area].totalPm10 += (item.pm10 || 0);
          areaMap[item.area].count++;
        });

      const airData = Object.keys(areaMap).map(area => ({
        area,
        pm25: parseFloat((areaMap[area].totalPm25 / areaMap[area].count).toFixed(1)),
        pm10: parseFloat((areaMap[area].totalPm10 / areaMap[area].count).toFixed(1))
      }));

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
        Air Quality by Area (Avg PM2.5 & PM10)
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="area" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'µg/m³', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="pm25" 
            fill="#8b5cf6" 
            name="PM2.5"
          />
          <Bar 
            dataKey="pm10" 
            fill="#3b82f6" 
            name="PM10"
          />
        </BarChart>
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
