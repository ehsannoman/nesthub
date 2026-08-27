const express = require('express');
const router = express.Router();
const { registerManager, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register-manager', registerManager);
router.post('/login', login);

// টেস্ট রুট — token ঠিকমতো verify হচ্ছে কিনা দেখার জন্য
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