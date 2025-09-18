const User = require('../models/User');

class AuthController {
  // Login endpoint
  static async login(req, res) {
    try {
      const { email, password, role } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      if (!role || !['customer', 'banker'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Valid role (customer or banker) is required'
        });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if role matches
      if (user.role !== role) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials for this role'
        });
      }

      // Verify password
      const isValidPassword = await user.verifyPassword(password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate access token
      const accessToken = await user.generateAccessToken();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          access_token: accessToken
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Register endpoint (for creating test users)
  static async register(req, res) {
    try {
      const { name, email, password, role = 'customer' } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      if (!['customer', 'banker'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role must be either customer or banker'
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create new user
      const userId = await User.create({ name, email, password, role });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user_id: userId
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Logout endpoint
  static async logout(req, res) {
    try {
      await req.user.removeAccessToken();

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      res.json({
        success: true,
        data: {
          user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            created_at: req.user.created_at
          }
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;
