const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const User = require('./models/User');

const DEFAULT_USER = {
  name: 'TaskFlow Tester',
  email: 'test@taskflow.local',
  password: 'Password123'
};

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskFlow API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/taskflow';
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    if (isProduction) {
      console.error('❌ Failed to connect to MongoDB in production:', err.message);
      process.exit(1);
    }

    console.warn('⚠️  MongoDB connection warning:', err.message);
    console.warn('⚠️  Falling back to in-memory MongoDB for development. Data will not persist after restart.');
    const memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to in-memory MongoDB');
  }

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  // Seed default user in development or in-memory mode
  try {
    const existingUser = await User.findOne({ email: DEFAULT_USER.email });
    if (!existingUser) {
      await User.create(DEFAULT_USER);
      console.log('✅ Seeded default user:', DEFAULT_USER.email);
    } else {
      console.log('✅ Default user already exists:', existingUser.email);
    }
  } catch (seedErr) {
    console.warn('⚠️  Failed to seed default user:', seedErr.message);
  }
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
