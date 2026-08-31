const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    flat: { type: String, required: true },
    courier: { type: String, required: true },
    photoUrl: { type: String },
    status: { type: String, enum: ['received', 'collected'], default: 'received' },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // কোন security
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);