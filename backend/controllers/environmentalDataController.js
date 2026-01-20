import EnvironmentalData from '../models/EnvironmentalData.js';

/**
 * Environmental Data Controller
 * Handles all environmental data related operations
 */

/**
 * @route   GET /api/environmental-data
 * @desc    Get all environmental data
 * @access  Public
 */
export const getAllEnvironmentalData = async (req, res) => {
  try {
    const envData = await EnvironmentalData.find()
      .sort({ recordedDate: -1 }) // Most recent first
      .lean();

    res.status(200).json({
      success: true,
      count: envData.length,
      data: envData
    });
  } catch (error) {
    console.error('Error fetching environmental data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch environmental data',
      error: error.message
    });
  }
};
