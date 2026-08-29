const express = require('express');
const router = express.Router();
const { registerManager, login, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register-manager', registerManager);
router.post('/login', login);
router.post('/change-password', protect, changePassword);

// টেস্ট রুট
router.get('/me', protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    buildingId: req.user.buildingId,
  });
});

module.exports = router;