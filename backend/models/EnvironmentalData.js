import mongoose from 'mongoose';

/**
 * Environmental Data Schema
 * Tracks air quality and water quality measurements
 */
const environmentalDataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['air', 'water'],
      trim: true
    },
    // Air quality specific fields
    aqi: {
      type: Number,
      min: 0,
      max: 500
    },
    pm25: {
      type: Number,
      min: 0
    },
    pm10: {
      type: Number,
      min: 0
    },
    co2: {
      type: Number,
      min: 0
    },
    // Water quality specific fields
    ph: {
      type: Number,
      min: 0,
      max: 14
    },
    turbidity: {
      type: Number,
      min: 0
    },
    dissolvedOxygen: {
      type: Number,
      min: 0
    },
    contaminants: {
      type: [String]
    },
    // Common fields
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
    qualityLevel: {
      type: String,
      enum: ['good', 'moderate', 'poor', 'hazardous'],
      default: 'moderate'
    },
    source: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
environmentalDataSchema.index({ type: 1, date: -1 });
environmentalDataSchema.index({ 'location.lat': 1, 'location.lng': 1 });
environmentalDataSchema.index({ area: 1 });

const EnvironmentalData = mongoose.model('EnvironmentalData', environmentalDataSchema);

export default EnvironmentalData;
