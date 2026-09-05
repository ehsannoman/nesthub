const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { askCommunityAI, generateNotice } = require('../controllers/aiController');

router.use(protect, requireRole('manager'));

router.post('/ask', askCommunityAI);
router.post('/generate-notice', generateNotice);

module.exports = router;