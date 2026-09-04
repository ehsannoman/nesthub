const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    name: { type: String, required: true },
    icon: { type: String, default: 'business-outline' },
    maxCapacity: { type: Number, required: true, default: 1 },
    bookingType: { type: String, enum: ['exclusive', 'shared'], default: 'shared' },
    pricePerHour: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);