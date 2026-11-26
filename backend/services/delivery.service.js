// backend/services/delivery.service.js
const { db } = require('./supabase.service');

/**
 * Calculates great-circle distance between two GPS coordinates in kilometers.
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Generates an actual Google Maps direct directions URL.
 */
function generateGoogleMapsNavUrl(lat, lng, address = '') {
  const dest = `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

/**
 * Finds the nearest online, available delivery partner and assigns the order.
 */
function assignDeliveryPartnerToOrder(order) {
  const restaurant = db.findRestaurantById(order.restaurant_id);
  if (!restaurant) return null;

  // Find all online and not busy partners
  const partners = db.getDeliveryPartners().filter(p => p.is_online && !p.is_busy);

  if (partners.length === 0) {
    // If no partner is currently online, pick an available partner or assign first active partner for demo
    const anyPartner = db.getDeliveryPartners()[0];
    if (anyPartner) {
      anyPartner.is_online = true;
      const assignment = db.createDeliveryAssignment(order.id, anyPartner.id);
      db.updateOrderStatus(order.id, 'preparing', null, `Delivery partner ${anyPartner.id} auto-assigned.`);
      return { partner: anyPartner, assignment };
    }
    return null;
  }

  // Sort by distance to restaurant pickup location
  const sorted = partners.map(p => ({
    partner: p,
    distanceKm: calculateDistanceKm(
      p.current_latitude,
      p.current_longitude,
      restaurant.latitude,
      restaurant.longitude
    )
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  const selected = sorted[0].partner;
  selected.is_busy = true;

  const assignment = db.createDeliveryAssignment(order.id, selected.id);
  db.updateOrderStatus(order.id, 'preparing', null, `Assigned to delivery partner.`);

  return { partner: selected, assignment, distanceKm: sorted[0].distanceKm };
}

module.exports = {
  calculateDistanceKm,
  generateGoogleMapsNavUrl,
  assignDeliveryPartnerToOrder
};
