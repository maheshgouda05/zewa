// backend/config/env.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5000',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  PAYMENT_GATEWAY_PROVIDER: process.env.PAYMENT_GATEWAY_PROVIDER || 'razorpay',
  PAYMENT_KEY_ID: process.env.PAYMENT_KEY_ID || '',
  PAYMENT_KEY_SECRET: process.env.PAYMENT_KEY_SECRET || '',
  MAX_ORDER_QUANTITY_PER_USER: parseInt(process.env.MAX_ORDER_QUANTITY_PER_USER || '2', 10),
  RESERVATION_TIMEOUT_MINUTES: parseInt(process.env.RESERVATION_TIMEOUT_MINUTES || '10', 10)
};
