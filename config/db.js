const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove any whitespace from the URI
    const uri = process.env.MONGODB_URI.trim();
    
    if (!uri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increase timeout
      socketTimeoutMS: 45000, // Increase socket timeout
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 