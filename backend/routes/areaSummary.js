import express from 'express';
import { getAreaSummary } from '../controllers/areaSummaryController.js';

const router = express.Router();

/**
 * Area Summary Routes
 * Base path: /api/area-summary
 */

/**
 * GET /api/area-summary
 * Get area-wise aggregated data with risk assessment
 */
router.get('/', getAreaSummary);

export default router;
