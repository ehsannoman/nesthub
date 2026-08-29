const Complaint = require('../models/Complaint');

// AI integration হওয়ার আগ পর্যন্ত simple rule দিয়ে priority ঠিক করছি
function suggestPriority(category, description) {
  const urgentKeywords = ['leak', 'fire', 'spark', 'stuck', 'broken', 'no water', 'no power'];
  const text = description.toLowerCase();
  if (category === 'Elevator' || category === 'Security') return 'High';
  if (urgentKeywords.some((k) => text.includes(k))) return 'High';
  if (category === 'Electrical' || category === 'Plumbing') return 'Medium';
  return 'Low';
}

// POST /api/complaints — Resident নতুন complaint submit করবে
async function createComplaint(req, res) {
  try {
    const { category, description, photoUrl } = req.body;

    if (!category || !description) {
      return res.status(400).json({ message: 'Category and description are required' });
    }

    const complaint = await Complaint.create({
      buildingId: req.user.buildingId,
      residentId: req.user._id,
      flat: req.user.flat || 'N/A',
      category,
      description,
      photoUrl,
      priority: suggestPriority(category, description),
      status: 'Open',
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error('createComplaint error:', err);
    res.status(500).json({ message: 'Failed to submit complaint' });
  }
}

// GET /api/complaints — Resident নিজের, Manager সবার complaints দেখবে
async function getComplaints(req, res) {
  try {
    const filter = { buildingId: req.user.buildingId };
    if (req.user.role === 'resident') {
      filter.residentId = req.user._id;
    }
    const complaints = await Complaint.find(filter).populate('residentId', 'name').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error('getComplaints error:', err);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
}

// GET /api/complaints/:id
async function getComplaintById(req, res) {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, buildingId: req.user.buildingId }).populate('residentId', 'name');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaint' });
  }
}

// PATCH /api/complaints/:id — Manager status/assign আপডেট করবে
async function updateComplaint(req, res) {
  try {
    const { status, assignedTo } = req.body;
    const update = {};
    if (status) update.status = status;
    if (assignedTo) update.assignedTo = assignedTo;

    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, buildingId: req.user.buildingId },
      update,
      { returnDocument: 'after' }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json(complaint);
  } catch (err) {
    console.error('updateComplaint error:', err);
    res.status(500).json({ message: 'Failed to update complaint' });
  }
}

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint };