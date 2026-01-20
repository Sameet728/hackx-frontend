import mongoose from 'mongoose';

/**
 * Health Incident Schema
 * Tracks health-related incidents in different areas
 */
const healthIncidentSchema = new mongoose.Schema(
  {
    diseaseType: {
      type: String,
      required: [true, 'Disease type is required'],
      enum: ['Dengue', 'Malaria', 'Covid', 'Cholera', 'Other'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    reportedDate: {
      type: Date,
      required: [true, 'Reported date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Index for geospatial queries (for map-based filtering)
healthIncidentSchema.index({ 'location.lat': 1, 'location.lng': 1 });
healthIncidentSchema.index({ reportedDate: -1 }); // For recent incidents
healthIncidentSchema.index({ area: 1 }); // For area-based queries

const HealthIncident = mongoose.model('HealthIncident', healthIncidentSchema);

export default HealthIncident;
