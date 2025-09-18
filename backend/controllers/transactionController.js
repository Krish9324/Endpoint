const Account = require('../models/Account');

class TransactionController {
  // Get transaction history for current user
  static async getTransactionHistory(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;

      const transactions = await Account.getTransactionHistory(userId, limit);

      res.json({
        success: true,
        data: {
          transactions,
          count: transactions.length
        }
      });

    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current balance
  static async getCurrentBalance(req, res) {
    try {
      const userId = req.user.id;
      const balance = await Account.getCurrentBalance(userId);

      res.json({
        success: true,
        data: {
          balance: balance
        }
      });

    } catch (error) {
      console.error('Get current balance error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Deposit money
  static async deposit(req, res) {
    try {
      const userId = req.user.id;
      const { amount } = req.body;

      // Validation
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid amount greater than 0 is required'
        });
      }

      const depositAmount = parseFloat(amount);
      
      if (depositAmount > 1000000) { // Max deposit limit
        return res.status(400).json({
          success: false,
          message: 'Deposit amount cannot exceed $1,000,000'
        });
      }

      // Get current balance
      const currentBalance = await Account.getCurrentBalance(userId);

      // Create deposit transaction
      const transaction = await Account.createTransaction(
        userId,
        'deposit',
        depositAmount,
        currentBalance
      );

      res.json({
        success: true,
        message: 'Deposit successful',
        data: {
          transaction: {
            id: transaction.id,
            type: transaction.transaction_type,
            amount: transaction.amount,
            balance_after: transaction.balance_after,
            created_at: transaction.created_at
          }
        }
      });

    } catch (error) {
      console.error('Deposit error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Withdraw money
  static async withdraw(req, res) {
    try {
      const userId = req.user.id;
      const { amount } = req.body;

      // Validation
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid amount greater than 0 is required'
        });
      }

      const withdrawAmount = parseFloat(amount);

      // Get current balance
      const currentBalance = await Account.getCurrentBalance(userId);

      // Check if sufficient funds
      if (withdrawAmount > currentBalance) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient funds'
        });
      }

      // Create withdrawal transaction
      const transaction = await Account.createTransaction(
        userId,
        'withdraw',
        withdrawAmount,
        currentBalance
      );

      res.json({
        success: true,
        message: 'Withdrawal successful',
        data: {
          transaction: {
            id: transaction.id,
            type: transaction.transaction_type,
            amount: transaction.amount,
            balance_after: transaction.balance_after,
            created_at: transaction.created_at
          }
        }
      });

    } catch (error) {
      console.error('Withdrawal error:', error);
      
      if (error.message === 'Insufficient funds') {
        return res.status(400).json({
          success: false,
          message: 'Insufficient funds'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get transaction statistics
  static async getTransactionStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await Account.getTransactionStats(userId);

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get transaction stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = TransactionController;
