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
      enum: [
        'waste_management',
        'drainage',
        'public_toilet',
        'water_supply',
        'street_cleaning',
        'other'
      ],
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
      enum: ['pending', 'in_progress', 'resolved', 'rejected'],
      default: 'pending'
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    description: {
      type: String,
      maxlength: 1000
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    reportedBy: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
sanitationComplaintSchema.index({ 'location.lat': 1, 'location.lng': 1 });
sanitationComplaintSchema.index({ status: 1, date: -1 });
sanitationComplaintSchema.index({ area: 1 });

const SanitationComplaint = mongoose.model('SanitationComplaint', sanitationComplaintSchema);

export default SanitationComplaint;
