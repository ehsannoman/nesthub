const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // কোন resident invite করেছে
    flat: { type: String, required: true },

    name: { type: String, required: true },
    phone: { type: String },
    vehicle: { type: String },

    visitDate: { type: String, required: true }, // "24/08/2026"
    visitTime: { type: String, required: true }, // "5:00 PM"

    qrToken: { type: String, required: true, unique: true }, // QR code এর ভেতরে যা encode হবে
    status: { type: String, enum: ['expected', 'entered', 'exited', 'rejected'], default: 'expected' },

    // walk-in visitor হলে এগুলো থাকবে
    isWalkIn: { type: Boolean, default: false },
    reason: { type: String },
    idPhotoUrl: { type: String },

    entryTime: { type: Date },
    exitTime: { type: Date },
    checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // কোন security check-in করেছে
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', visitorSchema);