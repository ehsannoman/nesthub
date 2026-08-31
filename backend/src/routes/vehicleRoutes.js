const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getVehicles, addVehicle, removeVehicle, checkVehicle } = require('../controllers/vehicleController');

router.use(protect);

router.get('/check', requireRole('security'), checkVehicle); // নির্দিষ্ট route আগে বসাতে হয়, /:id এর সাথে conflict এড়াতে
router.get('/', getVehicles); // resident/security/manager, controller এর ভেতরে filter হচ্ছে
router.post('/', requireRole('resident'), addVehicle);
router.delete('/:id', requireRole('resident'), removeVehicle);

module.exports = router;