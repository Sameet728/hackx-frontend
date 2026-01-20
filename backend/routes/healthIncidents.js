import express from 'express';
import { getAllHealthIncidents } from '../controllers/healthIncidentController.js';

const router = express.Router();

/**
 * Health Incidents Routes
 * Base path: /api/health-incidents
 */

/**
 * GET /api/health-incidents
 * Fetch all health incidents
 */
router.get('/', getAllHealthIncidents);

export default router;
