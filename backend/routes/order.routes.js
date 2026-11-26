// backend/routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateUser, requireAuth, requireCustomer } = require('../middleware/auth.middleware');

router.use(authenticateUser);

router.post('/checkout-reserve', requireAuth, requireCustomer, orderController.checkoutReserve);
router.post('/initiate-payment', requireAuth, requireCustomer, orderController.initiatePayment);
router.post('/create-payment-session', requireAuth, requireCustomer, orderController.initiatePayment);
router.post('/verify-confirm', requireAuth, requireCustomer, orderController.verifyAndConfirm);
router.post('/verify-payment', requireAuth, requireCustomer, orderController.verifyAndConfirm);
router.get('/my-orders', requireAuth, requireCustomer, orderController.getCustomerOrders);
router.get('/track/:id', authenticateUser, orderController.getOrderTracking);
router.get('/:id', authenticateUser, orderController.getOrderTracking);
router.post('/cancel/:id', requireAuth, requireCustomer, orderController.cancelOrder);

module.exports = router;
