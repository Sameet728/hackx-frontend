import SanitationComplaint from '../models/SanitationComplaint.js';

/**
 * Sanitation Complaint Controller
 * Handles all sanitation complaint related operations
 */

/**
 * @route   GET /api/sanitation-complaints
 * @desc    Get all sanitation complaints
 * @access  Public
 */
export const getAllSanitationComplaints = async (req, res) => {
  try {
    const complaints = await SanitationComplaint.find()
      .sort({ reportedDate: -1 }) // Most recent first
      .lean();

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Error fetching sanitation complaints:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sanitation complaints',
      error: error.message
    });
  }
};
