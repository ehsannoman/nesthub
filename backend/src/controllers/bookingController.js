const Booking = require('../models/Booking');
const Facility = require('../models/Facility');

// GET /api/bookings/availability?facilityId=...&date=YYYY-MM-DD
// প্রতিটা hour (0-23) এ কত capacity বাকি আছে সেটা রিটার্ন করে
async function getAvailability(req, res) {
  try {
    const { facilityId, date } = req.query;
    if (!facilityId || !date) {
      return res.status(400).json({ message: 'facilityId and date are required' });
    }

    const facility = await Facility.findOne({ _id: facilityId, buildingId: req.user.buildingId });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });

    const bookings = await Booking.find({
      facilityId,
      date,
      status: { $in: ['pending', 'approved'] },
    });

    const effectiveCapacity = facility.bookingType === 'exclusive' ? 1 : facility.maxCapacity;

    const hourlyApproved = Array(24).fill(0);
    const hourlyPending = Array(24).fill(0);

    bookings.forEach((b) => {
      for (let h = b.startHour; h < b.endHour; h++) {
        if (b.status === 'approved') hourlyApproved[h]++;
        else hourlyPending[h]++;
      }
    });

    const hourlyAvailability = Array.from({ length: 24 }, (_, hour) => {
      const approved = hourlyApproved[hour];
      const pending = hourlyPending[hour];
      const occupied = approved + pending;
      const isFull = occupied >= effectiveCapacity;

      // capacity বাকি থাকলে সবসময় 'available' — কিছু approved থাকলেও
      // শুধু পুরোপুরি ভরে গেলেই 'booked' বা 'pending' রঙ দেখাবে
      let status = 'available';
      if (isFull) {
        status = approved >= effectiveCapacity ? 'booked' : 'pending';
      }

      return {
        hour,
        remaining: Math.max(0, effectiveCapacity - occupied),
        isFull,
        status,
      };
    });

    res.json({
      facilityId,
      date,
      maxCapacity: facility.maxCapacity,
      pricePerHour: facility.pricePerHour,
      hourlyAvailability,
    });
  } catch (err) {
    console.error('getAvailability error:', err);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
}

// POST /api/bookings — Resident booking request করবে
async function createBooking(req, res) {
  try {
    const { facilityId, date, startHour, endHour } = req.body;

    if (!facilityId || !date || startHour === undefined || endHour === undefined) {
      return res.status(400).json({ message: 'facilityId, date, startHour, and endHour are required' });
    }
    if (startHour >= endHour) {
      return res.status(400).json({ message: 'End hour must be after start hour' });
    }

    const facility = await Facility.findOne({ _id: facilityId, buildingId: req.user.buildingId });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });

    // Capacity check — প্রতিটা hour এ এখনো জায়গা আছে কিনা
    const existingBookings = await Booking.find({
      facilityId,
      date,
      status: { $in: ['pending', 'approved'] },
    });

    const hourlyBookedCount = Array(24).fill(0);
    existingBookings.forEach((b) => {
      for (let h = b.startHour; h < b.endHour; h++) hourlyBookedCount[h]++;
    });

    const effectiveCapacity = facility.bookingType === 'exclusive' ? 1 : facility.maxCapacity;

    for (let h = startHour; h < endHour; h++) {
      if (hourlyBookedCount[h] >= effectiveCapacity) {
        return res.status(409).json({ message: `Facility is fully booked at ${h}:00. Please choose a different time.` });
      }
    }

    const hours = endHour - startHour;
    const totalPrice = hours * facility.pricePerHour;

    const booking = await Booking.create({
      buildingId: req.user.buildingId,
      facilityId,
      residentId: req.user._id,
      flat: req.user.flat || 'N/A',
      date, startHour, endHour, totalPrice,
      status: facility.bookingType === 'shared' ? 'approved' : 'pending', // shared facility সরাসরি confirm, exclusive এ manager approval লাগবে
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
}

// GET /api/bookings — Resident নিজের, Manager সবার booking দেখবে
async function getBookings(req, res) {
  try {
    const filter = { buildingId: req.user.buildingId };
    if (req.user.role === 'resident') filter.residentId = req.user._id;

    const bookings = await Booking.find(filter)
      .populate('facilityId', 'name icon')
      .populate('residentId', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}

// PATCH /api/bookings/:id — Manager approve/reject করবে
async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, buildingId: req.user.buildingId },
      { status },
      { returnDocument: 'after' }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking' });
  }
}

module.exports = { getAvailability, createBooking, getBookings, updateBookingStatus };