const crypto = require('crypto');
const Visitor = require('../models/Visitor');

// POST /api/visitors/invite — Resident নতুন visitor invite করবে, QR token generate হবে
async function inviteVisitor(req, res) {
  try {
    const { name, phone, visitDate, visitTime, vehicle } = req.body;

    if (!name || !phone || !visitDate || !visitTime) {
      return res.status(400).json({ message: 'Name, phone, date, and time are required' });
    }

    const qrToken = crypto.randomBytes(16).toString('hex');

    const visitor = await Visitor.create({
      buildingId: req.user.buildingId,
      invitedBy: req.user._id,
      flat: req.user.flat || 'N/A',
      name,
      phone,
      vehicle,
      visitDate,
      visitTime,
      qrToken,
      status: 'expected',
    });

    res.status(201).json({
      id: visitor._id,
      qrToken: visitor.qrToken, // frontend এই token দিয়ে QR code তৈরি করবে
      name: visitor.name,
      flat: visitor.flat,
      visitDate: visitor.visitDate,
      visitTime: visitor.visitTime,
      vehicle: visitor.vehicle,
    });
  } catch (err) {
    console.error('inviteVisitor error:', err);
    res.status(500).json({ message: 'Failed to create visitor invite' });
  }
}

// POST /api/visitors/scan — Security QR scan করে verify করবে
async function scanVisitor(req, res) {
  try {
    const { qrToken } = req.body;

    const visitor = await Visitor.findOne({ qrToken, buildingId: req.user.buildingId });

    if (!visitor) {
      return res.status(404).json({ valid: false, message: 'Invalid or unrecognized QR code' });
    }
    if (visitor.status === 'entered') {
      return res.status(409).json({ valid: false, message: 'This visitor has already checked in' });
    }
    if (visitor.status === 'exited' || visitor.status === 'rejected') {
      return res.status(409).json({ valid: false, message: 'This visitor pass is no longer valid' });
    }

    res.json({
      valid: true,
      visitor: {
        id: visitor._id,
        name: visitor.name,
        phone: visitor.phone,
        flat: visitor.flat,
        visitDate: visitor.visitDate,
        visitTime: visitor.visitTime,
        vehicle: visitor.vehicle,
      },
    });
  } catch (err) {
    console.error('scanVisitor error:', err);
    res.status(500).json({ valid: false, message: 'Failed to verify QR code' });
  }
}

// POST /api/visitors/:id/check-in — Security approve করবে entry
async function checkInVisitor(req, res) {
  try {
    const visitor = await Visitor.findOneAndUpdate(
      { _id: req.params.id, buildingId: req.user.buildingId },
      { status: 'entered', entryTime: new Date(), checkedInBy: req.user._id },
      { returnDocument: 'after' }
    );
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    // TODO (push notification integration): resident কে notify করা হবে এখানে

    res.json({ id: visitor._id, status: visitor.status });
  } catch (err) {
    console.error('checkInVisitor error:', err);
    res.status(500).json({ message: 'Failed to check in visitor' });
  }
}

// POST /api/visitors/:id/check-out
async function checkOutVisitor(req, res) {
  try {
    const visitor = await Visitor.findOneAndUpdate(
      { _id: req.params.id, buildingId: req.user.buildingId },
      { status: 'exited', exitTime: new Date() },
      { returnDocument: 'after' }
    );
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json({ id: visitor._id, status: visitor.status });
  } catch (err) {
    console.error('checkOutVisitor error:', err);
    res.status(500).json({ message: 'Failed to check out visitor' });
  }
}

// GET /api/visitors/today — Security এর dashboard এর জন্য
async function getTodayVisitors(req, res) {
  try {
    const visitors = await Visitor.find({ buildingId: req.user.buildingId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(visitors);
  } catch (err) {
    console.error('getTodayVisitors error:', err);
    res.status(500).json({ message: 'Failed to fetch visitors' });
  }
}

// GET /api/visitors/expected — শুধু 'expected' status
async function getExpectedVisitors(req, res) {
  try {
    const visitors = await Visitor.find({ buildingId: req.user.buildingId, status: 'expected' }).sort({ createdAt: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expected visitors' });
  }
}

// GET /api/visitors/inside — শুধু 'entered' status
async function getInsideVisitors(req, res) {
  try {
    const visitors = await Visitor.find({ buildingId: req.user.buildingId, status: 'entered' }).sort({ entryTime: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch visitors inside' });
  }
}

// POST /api/visitors/walk-in — Security walk-in visitor register করবে
async function registerWalkIn(req, res) {
  try {
    const { name, phone, reason, flat } = req.body;

    if (!name || !phone || !flat) {
      return res.status(400).json({ message: 'Name, phone, and flat are required' });
    }

    const qrToken = crypto.randomBytes(16).toString('hex');

    const visitor = await Visitor.create({
      buildingId: req.user.buildingId,
      invitedBy: req.user._id, // security নিজেই registering করছে
      flat,
      name,
      phone,
      visitDate: new Date().toLocaleDateString('en-GB'),
      visitTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      qrToken,
      isWalkIn: true,
      reason,
      status: 'expected', // resident approve করবে পরে (ভবিষ্যতে)
    });

    res.status(201).json({ id: visitor._id, status: visitor.status });
  } catch (err) {
    console.error('registerWalkIn error:', err);
    res.status(500).json({ message: 'Failed to register walk-in visitor' });
  }
}

// GET /api/visitors/my — Resident নিজের invite করা visitor গুলো দেখবে
async function getMyVisitors(req, res) {
  try {
    const visitors = await Visitor.find({ invitedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your visitors' });
  }
}

module.exports = {
  inviteVisitor, scanVisitor, checkInVisitor, checkOutVisitor,
  getTodayVisitors, getExpectedVisitors, getInsideVisitors, registerWalkIn, getMyVisitors,
};