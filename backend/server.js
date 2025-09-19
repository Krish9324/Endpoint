const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database configuration
const { testConnection, initializeDatabase } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const bankerRoutes = require('./routes/bankerRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://your-frontend-domain.vercel.app',
        'http://localhost:3000'
      ] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Banking System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/banker', bankerRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle specific error types
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry - resource already exists'
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference - related resource not found'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Banking System API...');
    console.log('🌐 Connecting to Aiven MySQL...');
    
    // Test database connection
    await testConnection();
    
    // Initialize database tables
    await initializeDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
      console.log(`💳 Transaction endpoints: http://localhost:${PORT}/api/transactions/*`);
      console.log(`🏦 Banker endpoints: http://localhost:${PORT}/api/banker/*`);
      console.log('');
      console.log('📝 Available endpoints:');
      console.log('  POST /api/auth/register - Register new user');
      console.log('  POST /api/auth/login - User login');
      console.log('  POST /api/auth/logout - User logout');
      console.log('  GET  /api/auth/profile - Get user profile');
      console.log('  GET  /api/transactions/history - Get transaction history');
      console.log('  GET  /api/transactions/balance - Get current balance');
      console.log('  POST /api/transactions/deposit - Make deposit');
      console.log('  POST /api/transactions/withdraw - Make withdrawal');
      console.log('  GET  /api/banker/customers - Get all customers (banker)');
      console.log('  GET  /api/banker/customers/:id/transactions - Customer transactions (banker)');
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
