const Vehicle = require('../models/Vehicle');

// GET /api/vehicles — Resident নিজের গাড়ি দেখবে, Security/Manager সব গাড়ি দেখবে
async function getVehicles(req, res) {
  try {
    const filter = { buildingId: req.user.buildingId };
    if (req.user.role === 'resident') {
      filter.ownerId = req.user._id;
    }
    const vehicles = await Vehicle.find(filter).populate('ownerId', 'name flat').sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error('getVehicles error:', err);
    res.status(500).json({ message: 'Failed to fetch vehicles' });
  }
}

// POST /api/vehicles — Resident নিজের নতুন গাড়ি যোগ করবে
async function addVehicle(req, res) {
  try {
    const { plateNumber, type, model } = req.body;
    if (!plateNumber) {
      return res.status(400).json({ message: 'Plate number is required' });
    }
    const vehicle = await Vehicle.create({
      buildingId: req.user.buildingId,
      ownerId: req.user._id,
      plateNumber,
      type,
      model,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('addVehicle error:', err);
    res.status(500).json({ message: 'Failed to add vehicle' });
  }
}

// DELETE /api/vehicles/:id
async function removeVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove vehicle' });
  }
}

// GET /api/vehicles/check?plate=... — Security প্লেট নম্বর দিয়ে খুঁজবে (Vehicle Check screen এর জন্য)
async function checkVehicle(req, res) {
  try {
    const { plate } = req.query;
    if (!plate) return res.status(400).json({ message: 'Plate number is required' });

    const vehicle = await Vehicle.findOne({
      buildingId: req.user.buildingId,
      plateNumber: { $regex: new RegExp(`^${plate}$`, 'i') }, // case-insensitive exact match
    }).populate('ownerId', 'name flat');

    if (!vehicle) {
      return res.json({ found: false });
    }

    res.json({
      found: true,
      plateNumber: vehicle.plateNumber,
      ownerName: vehicle.ownerId?.name,
      flat: vehicle.ownerId?.flat,
    });
  } catch (err) {
    console.error('checkVehicle error:', err);
    res.status(500).json({ message: 'Failed to check vehicle' });
  }
}

module.exports = { getVehicles, addVehicle, removeVehicle, checkVehicle };