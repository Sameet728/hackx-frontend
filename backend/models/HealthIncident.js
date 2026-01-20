import mongoose from 'mongoose';

/**
 * Health Incident Schema
 * Tracks health-related incidents in different areas
 */
const healthIncidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Incident type is required'],
      enum: ['disease_outbreak', 'epidemic', 'food_poisoning', 'other'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true
    },
    location: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: -180,
        max: 180
      }
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    description: {
      type: String,
      maxlength: 500
    },
    affectedCount: {
      type: Number,
      min: 0
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Index for geospatial queries (for future map-based filtering)
healthIncidentSchema.index({ 'location.lat': 1, 'location.lng': 1 });
healthIncidentSchema.index({ date: -1 }); // For recent incidents

const HealthIncident = mongoose.model('HealthIncident', healthIncidentSchema);

export default HealthIncident;
