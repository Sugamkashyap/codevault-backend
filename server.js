process.removeAllListeners('warning');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const snippetRoutes = require('./routes/snippetRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test MongoDB connection before starting server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/snippets', snippetRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong!' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer(); 