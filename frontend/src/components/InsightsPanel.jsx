import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

/**
 * InsightsPanel Component
 * Displays rule-based alerts and insights from area summary data
 */
function InsightsPanel() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    try {
      setLoading(true);
      
      // Fetch all necessary data
      const [areaSummaryResponse, envDataResponse, sanitationResponse] = await Promise.all([
        apiService.getAreaSummary(),
        apiService.getEnvironmentalData(),
        apiService.getSanitationComplaints()
      ]);

      const areaSummary = areaSummaryResponse.data;
      const envData = envDataResponse.data;
      const sanitationData = sanitationResponse.data;

      const generatedInsights = [];

      // ML Insight: AI Outbreak Predictions
      // Fetch predictions for unique areas (limit to 5 to manage load)
      const uniqueAreas = [...new Set(areaSummary.map(a => a.area))].slice(0, 5);
      
      // Create a specific Insight for ML predictions
      try {
        const mlPromises = uniqueAreas.map(area => apiService.getOutbreakRisk(area));
        const mlResults = await Promise.allSettled(mlPromises);
        
        mlResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            const pred = result.value;
            const probPercent = (pred.outbreakProbability * 100).toFixed(1);
            const drivers = pred.topDrivers && pred.topDrivers.length > 0 
              ? pred.topDrivers.join(', ') 
              : 'Multiple factors';

            if (pred.riskLevel === 'HIGH') {
              generatedInsights.push({
                type: 'critical',
                title: `🤖 AI ALERT: High Outbreak Risk in ${pred.area}`,
                description: `Model Confidence: ${probPercent}%. Key Drivers: ${drivers}`,
                action: 'Deploy preventive health inputs immediately'
              });
            } else if (pred.riskLevel === 'MODERATE') {
              generatedInsights.push({
                type: 'warning',
                title: `🤖 AI ALERT: Moderate Risk in ${pred.area}`,
                description: `Model Confidence: ${probPercent}%. Key Drivers: ${drivers}`,
                action: 'Increase vector control measures'
              });
            }
          }
        });
      } catch (mlErr) {
        console.error('ML Prediction Error:', mlErr);
        // Continue without ML insights if this fails
      }

      // Insight 1: High-risk areas
      const highRiskAreas = areaSummary.filter(area => area.riskLevel === 'HIGH');
      if (highRiskAreas.length > 0) {
        generatedInsights.push({
          type: 'critical',
          title: `${highRiskAreas.length} High-Risk Area${highRiskAreas.length > 1 ? 's' : ''} Detected`,
          description: `Areas with elevated risk: ${highRiskAreas.map(a => a.area).join(', ')}`,
          action: 'Immediate attention required'
        });
      }

      // Insight 2: Rising pollution levels
      const airData = envData.filter(d => d.type === 'air');
      const highPollutionAreas = airData.filter(d => d.pm25 > 100);
      if (highPollutionAreas.length > 0) {
        const avgPM25 = (highPollutionAreas.reduce((sum, d) => sum + d.pm25, 0) / highPollutionAreas.length).toFixed(1);
        generatedInsights.push({
          type: 'warning',
          title: 'Elevated Air Pollution Detected',
          description: `${highPollutionAreas.length} area${highPollutionAreas.length > 1 ? 's' : ''} with PM2.5 above safe levels (avg: ${avgPM25} µg/m³)`,
          action: 'Monitor air quality closely'
        });
      }

      // Insight 3: Pending sanitation complaints
      const openComplaints = sanitationData.filter(c => c.status === 'open');
      if (openComplaints.length > 3) {
        generatedInsights.push({
          type: 'warning',
          title: `${openComplaints.length} Pending Sanitation Complaints`,
          description: 'Multiple complaints awaiting resolution',
          action: 'Prioritize complaint processing'
        });
      }

      // Insight 4: Water quality concerns
      const waterData = envData.filter(d => d.type === 'water');
      const poorWaterQuality = waterData.filter(d => d.waterQualityIndex < 60);
      if (poorWaterQuality.length > 0) {
        generatedInsights.push({
          type: 'warning',
          title: 'Water Quality Below Standards',
          description: `${poorWaterQuality.length} location${poorWaterQuality.length > 1 ? 's' : ''} with water quality index below 60`,
          action: 'Conduct water treatment assessment'
        });
      }

      // Insight 5: Areas with multiple issues
      const multiIssueAreas = areaSummary.filter(area => 
        area.healthIncidentCount > 0 && area.sanitationComplaintCount > 2
      );
      if (multiIssueAreas.length > 0) {
        generatedInsights.push({
          type: 'info',
          title: 'Areas with Multiple Concerns',
          description: `${multiIssueAreas.length} area${multiIssueAreas.length > 1 ? 's' : ''} have both health incidents and sanitation issues`,
          action: 'Review correlation between health and sanitation'
        });
      }

      // Insight 6: Positive feedback (if applicable)
      const resolvedComplaints = sanitationData.filter(c => c.status === 'resolved');
      if (resolvedComplaints.length > 0 && sanitationData.length > 0) {
        const resolutionRate = ((resolvedComplaints.length / sanitationData.length) * 100).toFixed(0);
        if (resolutionRate > 30) {
          generatedInsights.push({
            type: 'success',
            title: 'Good Complaint Resolution Rate',
            description: `${resolutionRate}% of complaints have been resolved`,
            action: 'Continue current resolution practices'
          });
        }
      }

      setInsights(generatedInsights);
      setError(null);
    } catch (err) {
      setError('Failed to generate insights');
      console.error('Error generating insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'critical':
        return '⚠️';
      case 'warning':
        return '⚡';
      case 'success':
        return '✓';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-red-800';
      case 'warning':
        return 'text-orange-800';
      case 'success':
        return 'text-green-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Alerts & Insights
        </h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Alerts & Insights
        </h3>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Alerts & Insights
      </h3>

      {insights.length === 0 ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800">No critical alerts at this time. All systems normal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`border p-4 rounded-lg ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start">
                <span className="text-xl mr-3">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <h4 className={`font-semibold ${getTextColor(insight.type)} mb-1`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {insight.description}
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    Recommended: {insight.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InsightsPanel;
