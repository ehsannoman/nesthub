const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  inviteVisitor, scanVisitor, checkInVisitor, checkOutVisitor,
  getTodayVisitors, getExpectedVisitors, getInsideVisitors, registerWalkIn,
} = require('../controllers/visitorController');

router.use(protect); // সব route এ login লাগবে

router.post('/invite', requireRole('resident'), inviteVisitor);
router.post('/scan', requireRole('security'), scanVisitor);
router.post('/:id/check-in', requireRole('security'), checkInVisitor);
router.post('/:id/check-out', requireRole('security'), checkOutVisitor);
router.post('/walk-in', requireRole('security'), registerWalkIn);

router.get('/today', requireRole('security', 'manager'), getTodayVisitors);
router.get('/expected', requireRole('security', 'manager'), getExpectedVisitors);
router.get('/inside', requireRole('security', 'manager'), getInsideVisitors);

module.exports = router;