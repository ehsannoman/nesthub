const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    type: {
      type: String,
      enum: ['Apartment', 'Hostel', 'Gated Community', 'Other'],
      default: 'Apartment',
    },
    totalFloors: { type: Number },
    totalFlats: { type: Number },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Building', buildingSchema);