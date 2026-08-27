const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // কোন resident এর গাড়ি
    plateNumber: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Car', 'Motorcycle', 'Other'], default: 'Car' },
    model: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);