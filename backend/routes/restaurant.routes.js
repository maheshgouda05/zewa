// backend/routes/restaurant.routes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { authenticateUser, requireRestaurant } = require('../middleware/auth.middleware');

router.use(authenticateUser, requireRestaurant);

router.get('/dashboard', restaurantController.getRestaurantDashboard);
router.post('/food', restaurantController.addFoodListing);
router.put('/food/:id', restaurantController.updateFoodListing);
router.delete('/food/:id', restaurantController.deleteFoodListing);
router.put('/orders/:orderId/status', restaurantController.updateOrderStatus);

module.exports = router;
