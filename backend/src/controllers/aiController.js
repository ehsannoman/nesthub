const { getModel } = require('../utils/geminiClient');
const Complaint = require('../models/Complaint');
const Visitor = require('../models/Visitor');
const User = require('../models/User');

// POST /api/ai/ask — custom বা suggested question নিয়ে real data দিয়ে উত্তর দেয়
async function askCommunityAI(req, res) {
  try {
    const buildingId = req.user.buildingId;
    const question = req.body.question || 'How is my community doing today?';

    const [openComplaints, recentComplaints, totalVisitors, totalResidents] = await Promise.all([
      Complaint.countDocuments({ buildingId, status: { $nin: ['Resolved', 'Closed'] } }),
      Complaint.find({ buildingId }).sort({ createdAt: -1 }).limit(20),
      Visitor.countDocuments({ buildingId }),
      User.countDocuments({ buildingId, role: 'resident' }),
    ]);

    const categoryCounts = {};
    recentComplaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const prompt = `তুমি একটা apartment building এর community management AI assistant। নিচের real data ব্যবহার করে manager এর প্রশ্নের উত্তর দাও, সংক্ষিপ্ত এবং professional English এ (৩-৫ বাক্য, কোনো ভূমিকা ছাড়া সরাসরি উত্তর):

Data:
- Open complaints: ${openComplaints}
- Total residents: ${totalResidents}
- Total visitors (all time): ${totalVisitors}
- Recent complaint categories: ${JSON.stringify(categoryCounts)}

Manager's question: "${question}"

যদি data তে কোনো trend/সমস্যা দেখা যায় (যেমন কোনো একটা category তে complaint বেশি), সেটা উল্লেখ করো এবং একটা suggestion দাও।`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer, openComplaints, totalVisitors, totalResidents });
  } catch (err) {
    console.error('askCommunityAI error:', err);
    res.status(500).json({ message: 'Failed to get AI response' });
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

module.exports = { askCommunityAI, generateNotice };