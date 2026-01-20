import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiService } from '../services/api';

/**
 * SanitationTrendChart Component
 * Shows sanitation complaints over time
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
      
      // Group complaints by date
      const dataByDate = {};
      response.data.forEach(complaint => {
        const date = new Date(complaint.reportedDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!dataByDate[date]) {
          dataByDate[date] = {
            date,
            count: 0,
            open: 0,
            inProgress: 0,
            resolved: 0
          };
        }
        
        dataByDate[date].count++;
        
        if (complaint.status === 'open') dataByDate[date].open++;
        else if (complaint.status === 'in-progress') dataByDate[date].inProgress++;
        else if (complaint.status === 'resolved') dataByDate[date].resolved++;
      });

      // Convert to array and sort by date
      const chartArray = Object.values(dataByDate).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

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
        Sanitation Complaints Trend
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="open" 
            stroke="#ef4444" 
            name="Open"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="inProgress" 
            stroke="#f97316" 
            name="In Progress"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="resolved" 
            stroke="#22c55e" 
            name="Resolved"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SanitationTrendChart;
