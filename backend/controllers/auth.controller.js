// backend/controllers/auth.controller.js
const { db } = require('../services/supabase.service');

function getDemoAccounts(req, res) {
  res.json({
    success: true,
    accounts: [
      { role: 'customer', name: 'Aarav Sharma', email: 'customer@zewa.in', desc: 'Customer & Student' },
      { role: 'restaurant', name: 'Ramesh Gowda (The Green Bistro)', email: 'greenbistro@zewa.in', desc: 'Restaurant Owner' },
      { role: 'delivery_partner', name: 'Karthik Raja', email: 'delivery@zewa.in', desc: 'Delivery Partner' }
    ]
  });
}

function login(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  // Alias demo emails for instant compatibility
  const emailAliases = {
    'customer@zewa.demo': 'customer@zewa.in',
    'restaurant@zewa.demo': 'greenbistro@zewa.in',
    'delivery@zewa.demo': 'delivery@zewa.in'
  };
  if (emailAliases[email]) {
    email = emailAliases[email];
  }

  const profile = db.findProfileByEmail(email);
  if (!profile) {
    return res.status(404).json({ success: false, error: 'No account found with this email. Please register.' });
  }

  // If restaurant, attach their restaurant details
  let restaurant = null;
  if (profile.role === 'restaurant') {
    restaurant = db.findRestaurantByOwnerId(profile.id);
  }

  // If delivery partner, attach delivery partner details
  let deliveryPartner = null;
  if (profile.role === 'delivery_partner') {
    deliveryPartner = db.findDeliveryPartnerById(profile.id);
  }

  const token = profile.id;
  res.json({
    success: true,
    user: profile,
    token,
    session: {
      token,
      user: profile
    },
    restaurant,
    deliveryPartner,
    message: `Welcome back, ${profile.full_name}!`
  });
}

function register(req, res) {
  const { role, fullName, email, phone, restaurantName, restaurantType, address, latitude, longitude, openingTime, closingTime, vehicleType, vehicleNumber } = req.body;

  if (!email || !fullName || !role) {
    return res.status(400).json({ success: false, error: 'Full name, email and role are required.' });
  }

  const existing = db.findProfileByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  // Create Profile
  const profile = db.createProfile({
    role,
    full_name: fullName,
    email,
    phone: phone || ''
  });

  let restaurant = null;
  if (role === 'restaurant') {
    restaurant = db.createRestaurant({
      owner_id: profile.id,
      name: restaurantName || fullName,
      type: restaurantType || 'restaurant',
      address: address || 'Indiranagar, Bengaluru',
      latitude: latitude || 12.9716,
      longitude: longitude || 77.6412,
      opening_time: openingTime || '10:00:00',
      closing_time: closingTime || '22:00:00',
      phone: phone || ''
    });
  }

  let deliveryPartner = null;
  if (role === 'delivery_partner') {
    deliveryPartner = db.updateDeliveryPartner(profile.id, {
      vehicle_type: vehicleType || 'motorcycle',
      vehicle_number: vehicleNumber || 'KA-01-AB-1234',
      current_latitude: latitude || 12.9716,
      current_longitude: longitude || 77.6412,
      is_online: true
    });
  }

  res.status(201).json({
    success: true,
    user: profile,
    restaurant,
    deliveryPartner,
    message: 'Account registered successfully!'
  });
}

function getProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not logged in.' });
  }

  let restaurant = null;
  if (req.user.role === 'restaurant') {
    restaurant = db.findRestaurantByOwnerId(req.user.id);
  }

  let deliveryPartner = null;
  if (req.user.role === 'delivery_partner') {
    deliveryPartner = db.findDeliveryPartnerById(req.user.id);
  }

  res.json({
    success: true,
    user: req.user,
    restaurant,
    deliveryPartner
  });
}

module.exports = {
  getDemoAccounts,
  login,
  register,
  getProfile
};
