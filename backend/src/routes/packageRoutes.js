const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { registerPackage, getPackages, markCollected } = require('../controllers/packageController');

router.use(protect);

router.post('/', requireRole('security'), registerPackage);
router.get('/', getPackages); // security/manager/resident, controller এর ভেতরে filter হচ্ছে
router.patch('/:id', requireRole('security', 'resident'), markCollected);

module.exports = router;