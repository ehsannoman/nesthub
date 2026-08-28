const User = require('../models/User');
const { generateTempPassword } = require('../utils/generatePassword');

// GET /api/users — শুধু manager দেখতে পারবে, নিজের building এর সব ইউজার
async function getUsers(req, res) {
  try {
    const users = await User.find({ buildingId: req.user.buildingId, role: { $ne: 'manager' } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}

// POST /api/users — শুধু manager নতুন Resident/Security/Maintenance বানাতে পারবে
async function createUser(req, res) {
  try {
    const {
      name, email, phone, role,
      flat, ownershipType, moveInDate, emergencyContact,
      employeeId, joiningDate,
    } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required' });
    }

    if (role === 'manager') {
      return res.status(400).json({ message: 'Cannot create another manager account this way' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase(), buildingId: req.user.buildingId });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists in your building' });
    }

    const tempPassword = generateTempPassword();

    const newUser = await User.create({
      name,
      email,
      phone,
      password: tempPassword, // pre-save hook এ automatic hash হয়ে যাবে
      role,
      buildingId: req.user.buildingId,
      createdBy: req.user._id,
      mustChangePassword: true,
      flat,
      ownershipType,
      moveInDate,
      emergencyContact,
      employeeId,
      joiningDate,
    });

    // TODO (email integration): এখানে Nodemailer দিয়ে tempPassword ইউজারের email এ পাঠানো হবে।
    // আপাতত console এ log করছি যাতে test করা যায়।
    console.log(`📧 [MOCK EMAIL] To: ${email} — Your NestHub login: email=${email}, temporary password=${tempPassword}`);

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      flat: newUser.flat,
    });
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
}

// PATCH /api/users/:id — status active/inactive টগল করার জন্য
async function updateUserStatus(req, res) {
  try {
    const { status } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, buildingId: req.user.buildingId },
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, status: user.status });
  } catch (err) {
    console.error('updateUserStatus error:', err);
    res.status(500).json({ message: 'Failed to update user status' });
  }
}

module.exports = { getUsers, createUser, updateUserStatus };