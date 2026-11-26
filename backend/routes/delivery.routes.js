// backend/routes/delivery.routes.js
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { authenticateUser, requireDeliveryPartner } = require('../middleware/auth.middleware');

router.use(authenticateUser, requireDeliveryPartner);

router.get('/dashboard', deliveryController.getDeliveryDashboard);
router.post('/toggle-online', deliveryController.toggleOnlineStatus);
router.post('/location', deliveryController.updateLocation);
router.put('/status', deliveryController.updateStatus);
router.post('/assignments/:assignmentId/accept', deliveryController.acceptAssignment);
router.post('/assignments/:assignmentId/reject', deliveryController.rejectAssignment);
router.post('/assignments/:assignmentId/respond', deliveryController.respondAssignment);
router.post('/assignments/:assignmentId/pickup', deliveryController.markOrderPickedUp);
router.post('/assignments/:assignmentId/deliver', deliveryController.markOrderDelivered);
router.post('/assignments/:assignmentId/step', deliveryController.stepAssignment);

module.exports = router;
