require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // No more hardcoding!
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Stop app if DB fails
  }
};

module.exports = connectDB;