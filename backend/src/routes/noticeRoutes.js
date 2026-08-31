const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getNotices, publishNotice } = require('../controllers/noticeController');

router.use(protect);

router.get('/', getNotices);
router.post('/', requireRole('manager'), publishNotice);

module.exports = router;