const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { createComplaint, getComplaints, getComplaintById, updateComplaint } = require('../controllers/complaintController');

router.use(protect);

router.post('/', requireRole('resident'), createComplaint);
router.get('/', getComplaints); // resident/manager দুজনেই, controller এর ভেতরে ফিল্টার হচ্ছে
router.get('/:id', getComplaintById);
router.patch('/:id', requireRole('manager'), updateComplaint);

module.exports = router;