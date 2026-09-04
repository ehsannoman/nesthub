const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getMasterFacilityList, getFacilities, addFacility, updateFacility, deleteFacility } = require('../controllers/facilityController');

router.use(protect);

router.get('/master-list', requireRole('manager'), getMasterFacilityList);
router.get('/', getFacilities);
router.post('/', requireRole('manager'), addFacility);
router.patch('/:id', requireRole('manager'), updateFacility);
router.delete('/:id', requireRole('manager'), deleteFacility);

module.exports = router;