const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class User {
  constructor(id, name, email, password, role, access_token, created_at) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.access_token = access_token;
    this.created_at = created_at;
  }

  // Create a new user
  static async create(userData) {
    const { name, email, password, role = 'customer' } = userData;
    
    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const [result] = await pool.execute(
        'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Users WHERE email = ?',
        [email]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const user = rows[0];
      return new User(
        user.id,
        user.name,
        user.email,
        user.password,
        user.role,
        user.access_token,
        user.created_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Find user by access token
  static async findByToken(token) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Users WHERE access_token = ?',
        [token]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const user = rows[0];
      return new User(
        user.id,
        user.name,
        user.email,
        user.password,
        user.role,
        user.access_token,
        user.created_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Users WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const user = rows[0];
      return new User(
        user.id,
        user.name,
        user.email,
        user.password,
        user.role,
        user.access_token,
        user.created_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Get all customers (for banker view)
  static async getAllCustomers() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, created_at FROM Users WHERE role = ?',
        ['customer']
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Generate and store access token
  async generateAccessToken() {
    try {
      // Generate 36-character random alphanumeric token
      const token = crypto.randomBytes(18).toString('hex'); // 36 characters
      
      await pool.execute(
        'UPDATE Users SET access_token = ? WHERE id = ?',
        [token, this.id]
      );
      
      this.access_token = token;
      return token;
    } catch (error) {
      throw error;
    }
  }

  // Remove access token (logout)
  async removeAccessToken() {
    try {
      await pool.execute(
        'UPDATE Users SET access_token = NULL WHERE id = ?',
        [this.id]
      );
      
      this.access_token = null;
    } catch (error) {
      throw error;
    }
  }

  // Get user's current balance
  async getCurrentBalance() {
    try {
      const [rows] = await pool.execute(
        'SELECT balance_after FROM Accounts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [this.id]
      );
      
      return rows.length > 0 ? parseFloat(rows[0].balance_after) : 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
