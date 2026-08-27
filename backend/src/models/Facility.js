const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    name: { type: String, required: true },
    icon: { type: String, default: 'business-outline' },
    description: { type: String },
    isActive: { type: Boolean, default: true }, // Manager চাইলে বন্ধ/চালু করতে পারবে
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);