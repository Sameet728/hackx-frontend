import HealthIncident from '../models/HealthIncident.js';

/**
 * Health Incident Controller
 * Handles all health incident related operations
 */

/**
 * @route   GET /api/health-incidents
 * @desc    Get all health incidents
 * @access  Public
 */
export const getAllHealthIncidents = async (req, res) => {
  try {
    const incidents = await HealthIncident.find()
      .sort({ reportedDate: -1 }) // Most recent first
      .lean(); // Convert to plain JavaScript objects for better performance

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents
    });
  } catch (error) {
    console.error('Error fetching health incidents:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health incidents',
      error: error.message
    });
  }
};
