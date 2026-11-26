// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

router.get('/demo-accounts', authController.getDemoAccounts);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authenticateUser, authController.getProfile);
router.get('/me', authenticateUser, authController.getProfile);

module.exports = router;
