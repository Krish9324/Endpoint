const User = require('../models/User');

// Authentication middleware to verify access token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Find user by token
    const user = await User.findByToken(token);
    
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Customer-only middleware
const customerOnly = authorizeRole(['customer']);

// Banker-only middleware
const bankerOnly = authorizeRole(['banker']);

// Customer or Banker middleware
const customerOrBanker = authorizeRole(['customer', 'banker']);

module.exports = {
  authenticateToken,
  authorizeRole,
  customerOnly,
  bankerOnly,
  customerOrBanker
};
