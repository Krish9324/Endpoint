const express = require('express');
const TransactionController = require('../controllers/transactionController');
const { authenticateToken, customerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All transaction routes require authentication and customer role
router.use(authenticateToken);
router.use(customerOnly);

// Transaction routes
router.get('/history', TransactionController.getTransactionHistory);
router.get('/balance', TransactionController.getCurrentBalance);
router.get('/stats', TransactionController.getTransactionStats);
router.post('/deposit', TransactionController.deposit);
router.post('/withdraw', TransactionController.withdraw);

module.exports = router;
