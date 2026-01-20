import HealthIncident from '../models/HealthIncident.js';
import SanitationComplaint from '../models/SanitationComplaint.js';
import EnvironmentalData from '../models/EnvironmentalData.js';

/**
 * Builds the exact feature set required by the ML model for a given area
 * @param {string} areaName - The name of the area (e.g., "Pimpri")
 * @returns {Promise<Object>} - Feature object matching ml/feature_schema.json
 */
export const buildFeatures = async (areaName) => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);

  try {
    // 1. Health Incidents Queries
    const healthIncidents7d = await HealthIncident.countDocuments({
      area: areaName,
      reportedDate: { $gte: sevenDaysAgo, $lte: today }
    });

    const healthIncidents14d = await HealthIncident.countDocuments({
      area: areaName,
      reportedDate: { $gte: fourteenDaysAgo, $lte: today }
    });

    const dengueIncidents7d = await HealthIncident.countDocuments({
      area: areaName,
      diseaseType: 'Dengue',
      reportedDate: { $gte: sevenDaysAgo, $lte: today }
    });

    const malariaIncidents7d = await HealthIncident.countDocuments({
      area: areaName,
      diseaseType: 'Malaria',
      reportedDate: { $gte: sevenDaysAgo, $lte: today }
    });

    // 2. Sanitation Queries
    const openSanitationComplaints = await SanitationComplaint.countDocuments({
      area: areaName,
      status: 'open'
    });

    const totalSanitationComplaints7d = await SanitationComplaint.countDocuments({
      area: areaName,
      reportedDate: { $gte: sevenDaysAgo, $lte: today }
    });

    // 3. Environmental Queries
    const airQualityData = await EnvironmentalData.find({
      area: areaName,
      type: 'air',
      recordedDate: { $gte: sevenDaysAgo, $lte: today }
    });

    let avgPm25 = 0;
    let avgPm10 = 0;
    let maxPm25 = 0;

    if (airQualityData.length > 0) {
      const pm25Values = airQualityData.map(d => d.pm25).filter(v => v != null);
      const pm10Values = airQualityData.map(d => d.pm10).filter(v => v != null);
      
      if (pm25Values.length > 0) {
        avgPm25 = pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length;
        maxPm25 = Math.max(...pm25Values);
      }
      
      if (pm10Values.length > 0) {
        avgPm10 = pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length;
      }
    }

    // 4. Construct Feature Object (Order matters!)
    return {
      health_incidents_last_7d: healthIncidents7d,
      health_incidents_last_14d: healthIncidents14d,
      dengue_incidents_last_7d: dengueIncidents7d,
      malaria_incidents_last_7d: malariaIncidents7d,
      open_sanitation_complaints: openSanitationComplaints,
      total_sanitation_complaints_last_7d: totalSanitationComplaints7d,
      avg_pm25_last_7d: parseFloat(avgPm25.toFixed(2)),
      avg_pm10_last_7d: parseFloat(avgPm10.toFixed(2)),
      max_pm25_last_7d: parseFloat(maxPm25.toFixed(2))
    };

  } catch (error) {
    console.error('Error building features:', error);
    throw error;
  }
};
