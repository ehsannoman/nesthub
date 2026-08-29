const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flat: { type: String, required: true },

    category: {
      type: String,
      enum: ['Electrical', 'Plumbing', 'Elevator', 'Cleaning', 'Security', 'Internet', 'Others'],
      required: true,
    },
    description: { type: String, required: true },
    photoUrl: { type: String },

    status: { type: String, enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },

    assignedTo: { type: String }, // staff এর নাম (future এ User reference করা যাবে)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);