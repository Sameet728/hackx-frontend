import express from 'express';
import { getOutbreakRisk } from '../controllers/outbreakController.js';

const router = express.Router();
router.get('/outbreak-risk', getOutbreakRisk);

export default router;
