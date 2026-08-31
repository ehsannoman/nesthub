require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'NestHub API is running' });
});

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const visitorRoutes = require('./src/routes/visitorRoutes');
app.use('/api/visitors', visitorRoutes);

const complaintRoutes = require('./src/routes/complaintRoutes');
app.use('/api/complaints', complaintRoutes);

const noticeRoutes = require('./src/routes/noticeRoutes');
app.use('/api/notices', noticeRoutes);