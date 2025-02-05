const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log the URI to check its value
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    // Validate URI format
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    // Remove any whitespace and validate format
    const uri = process.env.MONGODB_URI.trim();
    
    // Parse the URI to validate its components
    const uriPattern = /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/;
    const match = uri.match(uriPattern);
    
    if (!match) {
      throw new Error('Invalid MongoDB URI format. Expected format: mongodb+srv://username:password@hostname/database');
    }

    const [, username, password, hostname, database] = match;
    console.log('URI Components:', {
      username,
      hostname,
      database
    });

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error details:', {
      message: error.message,
      uri: process.env.MONGODB_URI ? 'URI exists' : 'URI is undefined'
    });
    process.exit(1);
  }
};

module.exports = connectDB; 