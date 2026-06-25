require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const defaultUser = {
  name: 'TaskFlow Tester',
  email: 'test@taskflow.local',
  password: 'Password123'
};

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';

async function seedUser() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB at', uri);

    const existing = await User.findOne({ email: defaultUser.email });
    if (existing) {
      console.log('Default user already exists:');
      console.log(`  email: ${existing.email}`);
      console.log('  password: Password123');
    } else {
      const user = await User.create(defaultUser);
      console.log('Created default user:');
      console.log(`  id: ${user._id}`);
      console.log(`  email: ${user.email}`);
      console.log('  password: Password123');
    }
  } catch (err) {
    console.error('Failed to seed user:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedUser();
