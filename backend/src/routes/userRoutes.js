const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getUsers, createUser, updateUserStatus, getBuildingFlats } = require('../controllers/userController');

router.use(protect);

router.get('/flats', requireRole('security', 'manager'), getBuildingFlats);

router.get('/', requireRole('manager'), getUsers);
router.post('/', requireRole('manager'), createUser);
router.patch('/:id', requireRole('manager'), updateUserStatus);

module.exports = router;