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
    // Air quality specific fields (optional, only for air type)
    pm25: {
      type: Number,
      min: 0,
      required: function() {
        return this.type === 'air';
      }
    },
    pm10: {
      type: Number,
      min: 0,
      required: function() {
        return this.type === 'air';
      }
    },
    // Water quality specific field (optional, only for water type)
    waterQualityIndex: {
      type: Number,
      min: 0,
      max: 500,
      required: function() {
        return this.type === 'water';
      }
    },
    recordedDate: {
      type: Date,
      required: [true, 'Recorded date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
environmentalDataSchema.index({ type: 1, recordedDate: -1 });
environmentalDataSchema.index({ 'location.lat': 1, 'location.lng': 1 });
environmentalDataSchema.index({ area: 1 });

const EnvironmentalData = mongoose.model('EnvironmentalData', environmentalDataSchema);

export default EnvironmentalData;
