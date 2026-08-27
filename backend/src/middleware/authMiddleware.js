const jwt = require('jsonwebtoken');
const User = require('../models/User');

// এই middleware verify করবে token ঠিক আছে কিনা, req.user এ বসিয়ে দিবে
async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Account no longer exists' });
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'This account has been deactivated' });
    }
    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Session expired, please log in again' });
    }

    req.user = user; // পরের route handler গুলোতে req.user দিয়ে access করা যাবে
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// শুধু নির্দিষ্ট role গুলোকে route access দিবে
// ব্যবহার: router.post('/users', protect, requireRole('manager'), createUser)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied for your role' });
    }
    next();
  };
}

module.exports = { protect, requireRole };