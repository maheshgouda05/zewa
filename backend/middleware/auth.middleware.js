// backend/middleware/auth.middleware.js
const { db } = require('../services/supabase.service');

function authenticateUser(req, res, next) {
  let userId = req.headers['x-user-id'] || req.query.user_id;

  const authHeader = req.headers['authorization'];
  if (!userId && authHeader && authHeader.startsWith('Bearer ')) {
    userId = authHeader.substring(7).trim();
  }
  
  if (!userId) {
    // If not supplied, allow unauthenticated for public endpoints, but attach null
    req.user = null;
    return next();
  }

  const profile = db.findProfileById(userId) || db.findProfileByEmail(userId);
  if (!profile) {
    req.user = null;
    return next();
  }

  req.user = profile;
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
  }
  next();
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. This feature is restricted to ${roles.join(', ')} accounts only.`
      });
    }
    next();
  };
}

module.exports = {
  authenticateUser,
  requireAuth,
  requireRole,
  requireCustomer: requireRole('customer'),
  requireRestaurant: requireRole('restaurant'),
  requireDeliveryPartner: requireRole('delivery_partner')
};
