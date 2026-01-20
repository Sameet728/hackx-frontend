import express from 'express';
import { getAllEnvironmentalData } from '../controllers/environmentalDataController.js';

const router = express.Router();

/**
 * Environmental Data Routes
 * Base path: /api/environmental-data
 */

/**
 * GET /api/environmental-data
 * Fetch all environmental data
 */
router.get('/', getAllEnvironmentalData);

export default router;
