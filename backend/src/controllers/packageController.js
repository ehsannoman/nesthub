const Package = require('../models/Package');

// POST /api/packages — Security নতুন package register করবে
async function registerPackage(req, res) {
  try {
    const { flat, courier, photoUrl } = req.body;
    if (!flat || !courier) {
      return res.status(400).json({ message: 'Flat and courier are required' });
    }

    const pkg = await Package.create({
      buildingId: req.user.buildingId,
      flat,
      courier,
      photoUrl,
      registeredBy: req.user._id,
    });

    // TODO (push notification integration): resident কে notify করা হবে এখানে

    res.status(201).json(pkg);
  } catch (err) {
    console.error('registerPackage error:', err);
    res.status(500).json({ message: 'Failed to register package' });
  }
}

// GET /api/packages — Security/Manager সব দেখবে, Resident নিজেরটা দেখবে
async function getPackages(req, res) {
  try {
    const filter = { buildingId: req.user.buildingId };
    if (req.user.role === 'resident') {
      filter.flat = req.user.flat;
    }
    const packages = await Package.find(filter).sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    console.error('getPackages error:', err);
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
}

// PATCH /api/packages/:id — collected হিসেবে mark করা
async function markCollected(req, res) {
  try {
    const filter = { _id: req.params.id, buildingId: req.user.buildingId };
    if (req.user.role === 'resident') {
      filter.flat = req.user.flat; // resident শুধু নিজের ফ্ল্যাটের package touch করতে পারবে
    }

    const pkg = await Package.findOneAndUpdate(filter, { status: 'collected' }, { returnDocument: 'after' });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update package' });
  }
}

module.exports = { registerPackage, getPackages, markCollected };