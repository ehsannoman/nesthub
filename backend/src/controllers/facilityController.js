const Facility = require('../models/Facility');

// Master list — Manager এখান থেকে বেছে নিবে, frontend এও একই list রাখতে হবে dropdown এর জন্য
const MASTER_FACILITIES = [
  { name: 'Community Hall', icon: 'people-outline', bookingType: 'exclusive' },
  { name: 'Rooftop', icon: 'sunny-outline', bookingType: 'shared' },
  { name: 'Gym', icon: 'barbell-outline', bookingType: 'shared' },
  { name: 'Swimming Pool', icon: 'water-outline', bookingType: 'shared' },
  { name: 'BBQ Area', icon: 'flame-outline', bookingType: 'exclusive' },
  { name: 'Kids Play Area', icon: 'happy-outline', bookingType: 'shared' },
];

function getMasterFacilityList(req, res) {
  res.json(MASTER_FACILITIES);
}

// GET /api/facilities — সবাই দেখবে (শুধু active গুলো)
async function getFacilities(req, res) {
  try {
    const filter = { buildingId: req.user.buildingId };
    if (req.user.role === 'resident') filter.isActive = true; // resident শুধু active facility দেখবে
    const facilities = await Facility.find(filter).sort({ createdAt: -1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch facilities' });
  }
}

// POST /api/facilities — Manager নতুন facility enable করবে
async function addFacility(req, res) {
  try {
    const { name, icon, maxCapacity, pricePerHour } = req.body;
    if (!name || !maxCapacity || pricePerHour === undefined) {
      return res.status(400).json({ message: 'Name, capacity, and price are required' });
    }

    const masterEntry = MASTER_FACILITIES.find((m) => m.name === name);
    const bookingType = masterEntry?.bookingType || 'shared';

    const facility = await Facility.create({
      buildingId: req.user.buildingId,
      name, icon, maxCapacity, pricePerHour, bookingType,
    });
    res.status(201).json(facility);
  } catch (err) {
    console.error('addFacility error:', err);
    res.status(500).json({ message: 'Failed to add facility' });
  }
}

// PATCH /api/facilities/:id — active/inactive, capacity, price আপডেট
async function updateFacility(req, res) {
  try {
    const { maxCapacity, pricePerHour, isActive } = req.body;
    const update = {};
    if (maxCapacity !== undefined) update.maxCapacity = maxCapacity;
    if (pricePerHour !== undefined) update.pricePerHour = pricePerHour;
    if (isActive !== undefined) update.isActive = isActive;

    const facility = await Facility.findOneAndUpdate(
      { _id: req.params.id, buildingId: req.user.buildingId },
      update,
      { returnDocument: 'after' }
    );
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(facility);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update facility' });
  }
}

// DELETE /api/facilities/:id
async function deleteFacility(req, res) {
  try {
    const facility = await Facility.findOneAndDelete({ _id: req.params.id, buildingId: req.user.buildingId });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json({ message: 'Facility removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete facility' });
  }
}

module.exports = { getMasterFacilityList, getFacilities, addFacility, updateFacility, deleteFacility };