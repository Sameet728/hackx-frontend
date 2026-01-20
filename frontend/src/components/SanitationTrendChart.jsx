import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiService } from '../services/api';

/**
 * SanitationTrendChart Component
 * Shows sanitation complaints by area
 */
function SanitationTrendChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSanitationData();
  }, []);

  const fetchSanitationData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSanitationComplaints();
      
      // Group complaints by area
      const dataByArea = {};
      response.data.forEach(complaint => {
        const area = complaint.area || 'Unknown';
        
        if (!dataByArea[area]) {
          dataByArea[area] = {
            area,
            count: 0,
            open: 0,
            inProgress: 0,
            resolved: 0
          };
        }
        
        dataByArea[area].count++;
        
        if (complaint.status === 'open') dataByArea[area].open++;
        else if (complaint.status === 'in-progress') dataByArea[area].inProgress++;
        else if (complaint.status === 'resolved') dataByArea[area].resolved++;
      });

      // Convert to array
      const chartArray = Object.values(dataByArea);

      setChartData(chartArray);
      setError(null);
    } catch (err) {
      setError('Failed to load sanitation trend data');
      console.error('Error fetching sanitation data:', err);
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
        Sanitation Complaints by Area
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="area" 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="open" 
            fill="#ef4444" 
            name="Open"
          />
          <Bar 
            dataKey="inProgress" 
            fill="#f97316" 
            name="In Progress"
          />
          <Bar 
            dataKey="resolved" 
            fill="#22c55e" 
            name="Resolved"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SanitationTrendChart;
