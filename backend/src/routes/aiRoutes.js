const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getCommunitySummary, generateNotice } = require('../controllers/aiController');

router.use(protect, requireRole('manager'));

router.post('/community-summary', getCommunitySummary);
router.post('/generate-notice', generateNotice);

module.exports = router;