import HealthIncident from '../models/HealthIncident.js';
import SanitationComplaint from '../models/SanitationComplaint.js';
import EnvironmentalData from '../models/EnvironmentalData.js';

/**
 * Area Summary Controller
 * Provides aggregated data and risk assessment by area
 */

/**
 * Calculate risk level based on complaints and air quality
 * @param {number} complaintCount - Number of sanitation complaints
 * @param {number} avgPM25 - Average PM2.5 value (null if no data)
 * @returns {string} - Risk level: LOW, MEDIUM, or HIGH
 */
const calculateRiskLevel = (complaintCount, avgPM25) => {
  // HIGH: complaints > 10 AND avgPM25 > 150
  if (complaintCount > 10 && avgPM25 !== null && avgPM25 > 150) {
    return 'HIGH';
  }
  
  // MEDIUM: complaints > 5 OR avgPM25 > 100
  if (complaintCount > 5 || (avgPM25 !== null && avgPM25 > 100)) {
    return 'MEDIUM';
  }
  
  // LOW: otherwise
  return 'LOW';
};

/**
 * @route   GET /api/area-summary
 * @desc    Get area-wise summary with risk assessment
 * @access  Public
 */
export const getAreaSummary = async (req, res) => {
  try {
    // Fetch all data
    const [healthIncidents, sanitationComplaints, environmentalData] = await Promise.all([
      HealthIncident.find().lean(),
      SanitationComplaint.find().lean(),
      EnvironmentalData.find({ type: 'air' }).lean() // Only air quality for PM2.5
    ]);

    // Create a map to aggregate data by area
    const areaMap = new Map();

    // Process health incidents
    healthIncidents.forEach(incident => {
      if (!areaMap.has(incident.area)) {
        areaMap.set(incident.area, {
          area: incident.area,
          healthIncidentCount: 0,
          sanitationComplaintCount: 0,
          pm25Values: [],
          location: incident.location // Store location from first occurrence
        });
      }
      areaMap.get(incident.area).healthIncidentCount++;
    });

    // Process sanitation complaints
    sanitationComplaints.forEach(complaint => {
      if (!areaMap.has(complaint.area)) {
        areaMap.set(complaint.area, {
          area: complaint.area,
          healthIncidentCount: 0,
          sanitationComplaintCount: 0,
          pm25Values: [],
          location: complaint.location // Store location from first occurrence
        });
      }
      areaMap.get(complaint.area).sanitationComplaintCount++;
    });

    // Process environmental data (PM2.5 values)
    environmentalData.forEach(data => {
      if (!areaMap.has(data.area)) {
        areaMap.set(data.area, {
          area: data.area,
          healthIncidentCount: 0,
          sanitationComplaintCount: 0,
          pm25Values: [],
          location: data.location // Store location from first occurrence
        });
      }
      if (data.pm25 !== undefined && data.pm25 !== null) {
        areaMap.get(data.area).pm25Values.push(data.pm25);
      }
    });

    // Calculate averages and risk levels
    const areaSummary = Array.from(areaMap.values()).map(area => {
      // Calculate average PM2.5
      const avgPM25 = area.pm25Values.length > 0
        ? area.pm25Values.reduce((sum, val) => sum + val, 0) / area.pm25Values.length
        : null;

      // Calculate risk level
      const riskLevel = calculateRiskLevel(
        area.sanitationComplaintCount,
        avgPM25
      );

      return {
        area: area.area,
        location: area.location, // Include location for map plotting
        healthIncidentCount: area.healthIncidentCount,
        sanitationComplaintCount: area.sanitationComplaintCount,
        avgPM25: avgPM25 !== null ? parseFloat(avgPM25.toFixed(2)) : null,
        riskLevel: riskLevel
      };
    });

    // Sort by risk level (HIGH > MEDIUM > LOW) and then by area name
    const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    areaSummary.sort((a, b) => {
      if (riskOrder[b.riskLevel] !== riskOrder[a.riskLevel]) {
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
      return a.area.localeCompare(b.area);
    });

    res.status(200).json({
      success: true,
      count: areaSummary.length,
      data: areaSummary
    });
  } catch (error) {
    console.error('Error generating area summary:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate area summary',
      error: error.message
    });
  }
};
