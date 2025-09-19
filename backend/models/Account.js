const { pool } = require('../config/db');

class Account {
  constructor(id, user_id, transaction_type, amount, balance_after, created_at) {
    this.id = id;
    this.user_id = user_id;
    this.transaction_type = transaction_type;
    this.amount = amount;
    this.balance_after = balance_after;
    this.created_at = created_at;
  }

  // Create a new transaction
  static async createTransaction(user_id, transaction_type, amount, current_balance) {
    try {
      let new_balance;
      
      if (transaction_type === 'deposit') {
        new_balance = current_balance + amount;
      } else if (transaction_type === 'withdraw') {
        if (amount > current_balance) {
          throw new Error('Insufficient funds');
        }
        new_balance = current_balance - amount;
      } else {
        throw new Error('Invalid transaction type');
      }

      const [result] = await pool.execute(
        'INSERT INTO Accounts (user_id, transaction_type, amount, balance_after) VALUES (?, ?, ?, ?)',
        [user_id, transaction_type, amount, new_balance]
      );
      
      return {
        id: result.insertId,
        user_id,
        transaction_type,
        amount,
        balance_after: new_balance,
        created_at: new Date()
      };
    } catch (error) {
      throw error;
    }
  }

  // Get transaction history for a user
  static async getTransactionHistory(user_id, limit = 50) {
    try {
      const limitValue = parseInt(limit) || 50;
      const userIdValue = parseInt(user_id);
      
      if (isNaN(userIdValue)) {
        throw new Error('Invalid user_id provided');
      }

      // Try using query instead of execute
      const [rows] = await pool.query(
        'SELECT id, user_id, transaction_type, amount, balance_after, created_at FROM Accounts WHERE user_id = ? ORDER BY id DESC LIMIT ?',
        [userIdValue, limitValue]
      );
      
      return rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        transaction_type: row.transaction_type,
        amount: parseFloat(row.amount),
        balance_after: parseFloat(row.balance_after),
        created_at: row.created_at
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get all customers with their current balances (for banker view)
  static async getAllCustomersWithBalances() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.created_at as user_created_at,
          COALESCE(
            (SELECT balance_after 
             FROM Accounts a 
             WHERE a.user_id = u.id 
             ORDER BY a.id DESC 
             LIMIT 1), 0
          ) as current_balance,
          (SELECT COUNT(*) 
           FROM Accounts a 
           WHERE a.user_id = u.id
          ) as transaction_count
        FROM Users u 
        WHERE u.role = 'customer'
        ORDER BY u.created_at DESC
      `);
      
      return rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        user_created_at: row.user_created_at,
        current_balance: parseFloat(row.current_balance),
        transaction_count: row.transaction_count
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get current balance for a user
  static async getCurrentBalance(user_id) {
    try {
      const [rows] = await pool.execute(
        'SELECT balance_after FROM Accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [user_id]
      );
      
      return rows.length > 0 ? parseFloat(rows[0].balance_after) : 0;
    } catch (error) {
      throw error;
    }
  }

  // Get transaction statistics for a user
  static async getTransactionStats(user_id) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          COUNT(*) as total_transactions,
          SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END) as total_deposits,
          SUM(CASE WHEN transaction_type = 'withdraw' THEN amount ELSE 0 END) as total_withdrawals,
          (SELECT balance_after FROM Accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1) as current_balance
        FROM Accounts 
        WHERE user_id = ?
      `, [user_id, user_id]);
      
      const stats = rows[0];
      return {
        total_transactions: stats.total_transactions || 0,
        total_deposits: parseFloat(stats.total_deposits) || 0,
        total_withdrawals: parseFloat(stats.total_withdrawals) || 0,
        current_balance: parseFloat(stats.current_balance) || 0
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Account;
