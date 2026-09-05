const { getModel } = require('../utils/geminiClient');
const Complaint = require('../models/Complaint');
const Visitor = require('../models/Visitor');
const User = require('../models/User');

// POST /api/ai/community-summary — real data নিয়ে Gemini দিয়ে বিশ্লেষণ করে
async function getCommunitySummary(req, res) {
  try {
    const buildingId = req.user.buildingId;

    const [openComplaints, totalComplaints, todayVisitorsCount, totalResidents] = await Promise.all([
      Complaint.countDocuments({ buildingId, status: { $nin: ['Resolved', 'Closed'] } }),
      Complaint.find({ buildingId }).sort({ createdAt: -1 }).limit(20),
      Visitor.countDocuments({ buildingId }),
      User.countDocuments({ buildingId, role: 'resident' }),
    ]);

    // ক্যাটাগরি অনুযায়ী complaint গোনা, যাতে AI trend ধরতে পারে
    const categoryCounts = {};
    totalComplaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const prompt = `তুমি একটা apartment building এর community management assistant। নিচের real data দেখে ২-৩ লাইনের সংক্ষিপ্ত, professional English সামারি লিখো (Bangladesh এর apartment context এ):

- Open complaints: ${openComplaints}
- Total residents: ${totalResidents}
- Total visitors (all time): ${todayVisitorsCount}
- Complaint categories breakdown: ${JSON.stringify(categoryCounts)}

যদি কোনো category তে complaint বেশি দেখা যায়, সেটা নিয়ে একটা সতর্কতা/insight যোগ করো। সংক্ষিপ্ত এবং কাজের কথা বলো, কোনো ভূমিকা ছাড়াই সরাসরি সামারি দাও।`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    res.json({
      openComplaints,
      pendingMaintenance: openComplaints, // আপাতত একই, future এ আলাদা maintenance model হলে ভাগ হবে
      todayVisitors: todayVisitorsCount,
      occupancyRate: totalResidents > 0 ? 100 : 0, // placeholder, actual flat count দরকার সঠিক হিসাবের জন্য
      insight,
    });
  } catch (err) {
    console.error('getCommunitySummary error:', err);
    res.status(500).json({ message: 'Failed to generate community summary' });
  }
}

// POST /api/ai/generate-notice — draft কে professional notice বানায়
async function generateNotice(req, res) {
  try {
    const { draft } = req.body;
    if (!draft || !draft.trim()) {
      return res.status(400).json({ message: 'Draft text is required' });
    }

    const prompt = `তুমি একটা apartment building manager এর জন্য notice লেখার সহকারী। নিচের সংক্ষিপ্ত, informal নোট (বাংলা বা ইংরেজি হতে পারে) থেকে একটা professional English notice বানাও যেটা residents কে পাঠানো হবে।

Format এভাবে দাও:
Line 1: শুধু Title (একটা লাইন, ছোট)
তারপর একটা blank line
তারপর: পুরো notice body (২-৪ বাক্য, polite এবং professional tone এ)

Manager এর draft: "${draft}"

শুধু title আর body দাও, অন্য কোনো ব্যাখ্যা বা ভূমিকা ছাড়া।`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // প্রথম লাইন কে title হিসেবে, বাকিটা body হিসেবে split করছি
    const lines = text.split('\n').filter((l) => l.trim());
    const title = lines[0]?.replace(/^(title:|#)/i, '').trim() || 'Notice';
    const body = lines.slice(1).join('\n').trim() || text;

    res.json({ title, body });
  } catch (err) {
    console.error('generateNotice error:', err);
    res.status(500).json({ message: 'Failed to generate notice' });
  }
}

module.exports = { getCommunitySummary, generateNotice };