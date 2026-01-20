import mongoose from 'mongoose';

/**
 * Sanitation Complaint Schema
 * Tracks sanitation-related complaints from citizens
 */
const sanitationComplaintSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Garbage Overflow', 'Drainage', 'Water Logging', 'Public Toilet'],
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
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open'
    },
    reportedDate: {
      type: Date,
      required: [true, 'Reported date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
sanitationComplaintSchema.index({ 'location.lat': 1, 'location.lng': 1 });
sanitationComplaintSchema.index({ status: 1, reportedDate: -1 });
sanitationComplaintSchema.index({ area: 1 });

const SanitationComplaint = mongoose.model('SanitationComplaint', sanitationComplaintSchema);

export default SanitationComplaint;
