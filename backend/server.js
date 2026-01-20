import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import healthRoutes from './routes/health.js';
import healthIncidentRoutes from './routes/healthIncidents.js';
import sanitationComplaintRoutes from './routes/sanitationComplaints.js';
import environmentalDataRoutes from './routes/environmentalData.js';
import areaSummaryRoutes from './routes/areaSummary.js';
import outbreakRoutes from './routes/outbreak.js';
import authRoutes from './routes/auth.js';
import { protect } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await connectDB();

app.use(cors({
  origin: [
    "https://hackx-frontend.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// IMPORTANT: handle preflight
app.options("*", cors());


// Routes
app.use('/api/auth', authRoutes);
// Protected Data Routes (Require Login)
app.use('/api/health', protect, healthRoutes);
app.use('/api/health-incidents', protect, healthIncidentRoutes);
app.use('/api/sanitation-complaints', protect, sanitationComplaintRoutes);
app.use('/api/environmental-data', protect, environmentalDataRoutes);
app.use('/api/area-summary', protect, areaSummaryRoutes);
app.use('/api', protect, outbreakRoutes); // Mounts /api/outbreak-risk

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'HackX - Public Health & Urban Risk Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      healthIncidents: '/api/health-incidents',
      sanitationComplaints: '/api/sanitation-complaints',
      environmentalData: '/api/environmental-data',
      areaSummary: '/api/area-summary'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});
