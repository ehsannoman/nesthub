const Notice = require('../models/Notice');

// GET /api/notices — সবাই দেখতে পারবে (resident/security/manager)
async function getNotices(req, res) {
  try {
    const notices = await Notice.find({ buildingId: req.user.buildingId }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    console.error('getNotices error:', err);
    res.status(500).json({ message: 'Failed to fetch notices' });
  }
}

// POST /api/notices — শুধু manager publish করতে পারবে
async function publishNotice(req, res) {
  try {
    const { title, body, isEmergency } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const notice = await Notice.create({
      buildingId: req.user.buildingId,
      publishedBy: req.user._id,
      title,
      body,
      isEmergency: !!isEmergency,
    });

    // TODO (push notification integration): সব resident কে notify করা হবে এখানে
    // isEmergency হলে priority push notification পাঠানো হবে

    res.status(201).json(notice);
  } catch (err) {
    console.error('publishNotice error:', err);
    res.status(500).json({ message: 'Failed to publish notice' });
  }
}

module.exports = { getNotices, publishNotice };