const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { getUsers, createUser, updateUserStatus } = require('../controllers/userController');

// এই সব route এ শুধু logged-in manager ঢুকতে পারবে
router.use(protect, requireRole('manager'));

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUserStatus);

module.exports = router;