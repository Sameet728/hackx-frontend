import express from 'express';
import { getAllSanitationComplaints } from '../controllers/sanitationComplaintController.js';

const router = express.Router();

/**
 * Sanitation Complaints Routes
 * Base path: /api/sanitation-complaints
 */

/**
 * GET /api/sanitation-complaints
 * Fetch all sanitation complaints
 */
router.get('/', getAllSanitationComplaints);

export default router;
