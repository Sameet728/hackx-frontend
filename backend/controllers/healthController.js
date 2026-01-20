/**
 * Health Check Controller
 * Provides basic server health status endpoint
 */

/**
 * @route   GET /api/health
 * @desc    Get server health status
 * @access  Public
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'Server running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected' // Will be dynamic once we add actual DB checks
  });
};
