const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/consultation_recording_manager';
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log('Ensure MongoDB service is running locally on your machine.');
    // In dev, let server start up even if DB connection fails so developer can troubleshoot
  }
};

module.exports = connectDB;
