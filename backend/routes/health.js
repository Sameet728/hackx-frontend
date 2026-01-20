import express from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const router = express.Router();

/**
 * Health Check Route
 * GET /api/health
 */
router.get('/', getHealthStatus);

export default router;
