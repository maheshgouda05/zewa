// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const orderRoutes = require('./routes/order.routes');
const deliveryRoutes = require('./routes/delivery.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '..')));

// Favicon handler
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/assets/favicon.svg'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'ZEWA (Zero Waste) Food Surplus Marketplace',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback to frontend index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start listening if run directly
if (require.main === module) {
  app.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌱 ZEWA Food Surplus Marketplace Backend Server Running`);
    console.log(`📍 Port: http://localhost:${env.PORT}`);
    console.log(`🌐 Frontend Served from: /frontend`);
    console.log(`⚡ Environment: ${env.NODE_ENV}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
