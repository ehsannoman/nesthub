const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flat: { type: String, required: true },

    date: { type: String, required: true }, // "2026-08-30" ফরম্যাটে
    startHour: { type: Number, required: true, min: 0, max: 23 },
    endHour: { type: Number, required: true, min: 1, max: 24 }, // exclusive — মানে 18-20 হলে 6PM-8PM

    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);