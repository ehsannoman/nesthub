const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Building = require('../models/Building');

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role, buildingId: user.buildingId, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// POST /api/auth/register-manager
// এটাই একমাত্র public signup — শুধু Manager/Owner নিজে account + building বানাতে পারবে
async function registerManager(req, res) {
  try {
    const { name, email, phone, password, buildingName, buildingAddress, buildingType, totalFloors, totalFlats } = req.body;

    if (!name || !email || !password || !buildingName || !buildingAddress) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // প্রথমে user বানাচ্ছি building ছাড়া (কারণ buildingId লাগবে, কিন্তু building এর ownerUserId ও userId লাগবে — chicken-egg সমস্যা)
    const manager = new User({
      name,
      email,
      phone,
      password,
      role: 'manager',
      buildingId: null, // সাময়িকভাবে null, নিচে বসিয়ে দিব
    });

    const building = new Building({
      name: buildingName,
      address: buildingAddress,
      type: buildingType || 'Apartment',
      totalFloors,
      totalFlats,
      ownerUserId: manager._id,
    });

    manager.buildingId = building._id;

    await manager.save();
    await building.save();

    const token = generateToken(manager);

    res.status(201).json({
      token,
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
        buildingId: manager.buildingId,
      },
      building: {
        id: building._id,
        name: building.name,
      },
    });
  } catch (err) {
    console.error('registerManager error:', err);
    res.status(500).json({ message: 'Something went wrong while creating your account' });
  }
}

// POST /api/auth/login — সবার জন্য (manager/resident/security/maintenance)
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'This account has been deactivated. Contact your manager.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        buildingId: user.buildingId,
        flat: user.flat,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Something went wrong while logging in' });
  }
}

module.exports = { registerManager, login };