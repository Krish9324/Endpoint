const User = require('../models/User');
const Account = require('../models/Account');

class BankerController {
  // Get all customers with their balances
  static async getAllCustomers(req, res) {
    try {
      const customers = await Account.getAllCustomersWithBalances();

      res.json({
        success: true,
        data: {
          customers,
          count: customers.length
        }
      });

    } catch (error) {
      console.error('Get all customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get specific customer details
  static async getCustomerDetails(req, res) {
    try {
      const { customerId } = req.params;

      if (!customerId || isNaN(customerId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid customer ID is required'
        });
      }

      // Get customer info
      const customer = await User.findById(parseInt(customerId));
      
      if (!customer || customer.role !== 'customer') {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      // Get customer's current balance and stats
      const balance = await Account.getCurrentBalance(customer.id);
      const stats = await Account.getTransactionStats(customer.id);

      res.json({
        success: true,
        data: {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            created_at: customer.created_at
          },
          balance: balance,
          stats: stats
        }
      });

    } catch (error) {
      console.error('Get customer details error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get customer transaction history
  static async getCustomerTransactions(req, res) {
    try {
      const { customerId } = req.params;
      const limit = parseInt(req.query.limit) || 50;

      if (!customerId || isNaN(customerId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid customer ID is required'
        });
      }

      // Verify customer exists
      const customer = await User.findById(parseInt(customerId));
      
      if (!customer || customer.role !== 'customer') {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      // Get transaction history
      const transactions = await Account.getTransactionHistory(customer.id, limit);

      res.json({
        success: true,
        data: {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email
          },
          transactions,
          count: transactions.length
        }
      });

    } catch (error) {
      console.error('Get customer transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get banking system overview/dashboard
  static async getDashboardStats(req, res) {
    try {
      // Get total customers
      const customers = await User.getAllCustomers();
      const totalCustomers = customers.length;

      // Get all customer balances
      const customersWithBalances = await Account.getAllCustomersWithBalances();
      
      // Calculate total system balance
      const totalSystemBalance = customersWithBalances.reduce(
        (sum, customer) => sum + customer.current_balance, 
        0
      );

      // Calculate total transactions
      const totalTransactions = customersWithBalances.reduce(
        (sum, customer) => sum + customer.transaction_count, 
        0
      );

      // Find top customers by balance
      const topCustomers = customersWithBalances
        .sort((a, b) => b.current_balance - a.current_balance)
        .slice(0, 5);

      res.json({
        success: true,
        data: {
          overview: {
            total_customers: totalCustomers,
            total_system_balance: totalSystemBalance,
            total_transactions: totalTransactions,
            average_balance: totalCustomers > 0 ? totalSystemBalance / totalCustomers : 0
          },
          top_customers: topCustomers
        }
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Search customers by name or email
  static async searchCustomers(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
      }

      const searchTerm = `%${query.trim()}%`;
      
      // Search in database
      const { pool } = require('../config/db');
      const [rows] = await pool.execute(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.created_at,
          COALESCE(
            (SELECT balance_after 
             FROM Accounts a 
             WHERE a.user_id = u.id 
             ORDER BY a.created_at DESC 
             LIMIT 1), 0
          ) as current_balance
        FROM Users u 
        WHERE u.role = 'customer' 
        AND (u.name LIKE ? OR u.email LIKE ?)
        ORDER BY u.name ASC
        LIMIT 20
      `, [searchTerm, searchTerm]);

      const customers = rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        created_at: row.created_at,
        current_balance: parseFloat(row.current_balance)
      }));

      res.json({
        success: true,
        data: {
          customers,
          count: customers.length,
          query: query.trim()
        }
      });

    } catch (error) {
      console.error('Search customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = BankerController;
