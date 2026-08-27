const express = require('express');
const router = express.Router();
const { registerManager, login } = require('../controllers/authController');

router.post('/register-manager', registerManager);
router.post('/login', login);

module.exports = router;