const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isEmergency: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);