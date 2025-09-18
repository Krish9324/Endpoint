const express = require('express');
const BankerController = require('../controllers/bankerController');
const { authenticateToken, bankerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All banker routes require authentication and banker role
router.use(authenticateToken);
router.use(bankerOnly);

// Banker routes
router.get('/dashboard', BankerController.getDashboardStats);
router.get('/customers', BankerController.getAllCustomers);
router.get('/customers/search', BankerController.searchCustomers);
router.get('/customers/:customerId', BankerController.getCustomerDetails);
router.get('/customers/:customerId/transactions', BankerController.getCustomerTransactions);

module.exports = router;
