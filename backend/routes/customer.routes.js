// backend/routes/customer.routes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const orderController = require('../controllers/order.controller');
const { authenticateUser, requireCustomer } = require('../middleware/auth.middleware');

router.get('/food', authenticateUser, customerController.getNearbySurplusFood);
router.get('/feed', authenticateUser, customerController.getNearbySurplusFood);
router.get('/food/:id', authenticateUser, customerController.getFoodItemDetails);
router.post('/reserve', authenticateUser, requireCustomer, orderController.checkoutReserve);

module.exports = router;
