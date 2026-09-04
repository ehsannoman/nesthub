const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getAvailability, createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');

router.use(protect);

router.get('/availability', getAvailability);
router.get('/', getBookings);
router.post('/', requireRole('resident'), createBooking);
router.patch('/:id', requireRole('manager'), updateBookingStatus);

module.exports = router;