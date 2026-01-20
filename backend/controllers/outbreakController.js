import { buildFeatures } from '../utils/featureBuilder.js';
import { predictOutbreak } from '../ml/outbreakPredictor.js';

/**
 * @desc    Get outbreak risk prediction for an area
 * @route   GET /api/outbreak-risk
 * @access  Public
 */
export const getOutbreakRisk = async (req, res) => {
  try {
    const { area } = req.query;

    if (!area) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an area name (e.g., ?area=Pimpri)'
      });
    }

    // 1. Build Features from Database
    const features = await buildFeatures(area);

    // 2. Run ML Prediction
    const prediction = await predictOutbreak(features);

    // 3. Format Response
    res.status(200).json({
      success: true,
      data: {
        area: area,
        outbreakProbability: parseFloat((prediction.probability * 100).toFixed(1)), // Convert to percentage
        riskLevel: prediction.risk_level,
        predictionWindow: 'Next 7 days',
        topDrivers: prediction.top_drivers,
        timestamp: new Date()
      }
    });

  } catch (err) {
    console.error(`Error calculating risk for ${req.query.area}:`, err);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not calculate outbreak risk'
    });
  }
};
