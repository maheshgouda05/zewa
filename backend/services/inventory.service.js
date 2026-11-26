// backend/services/inventory.service.js
const { db } = require('./supabase.service');
const env = require('../config/env');

/**
 * Checks if customer exceeds the maximum purchase limit (2 units per listing).
 */
function checkCustomerPurchaseLimit(customerId, foodItemId, requestedQty) {
  if (requestedQty < 1 || requestedQty > env.MAX_ORDER_QUANTITY_PER_USER) {
    return {
      allowed: false,
      reason: `Maximum ${env.MAX_ORDER_QUANTITY_PER_USER} units allowed per customer for this food item.`
    };
  }

  // Check active reservations
  const activeReservations = db.getActiveCustomerReservations(customerId, foodItemId);
  const reservedQty = activeReservations.reduce((sum, r) => sum + r.quantity, 0);

  // Check active/delivered orders in the past 12 hours
  const recentOrders = db.getOrders({ customer_id: customerId })
    .filter(o => o.status !== 'cancelled' && (Date.now() - new Date(o.created_at).getTime()) < 12 * 3600 * 1000);
  
  let orderedQty = 0;
  for (const order of recentOrders) {
    const items = db.getOrderItems(order.id).filter(i => i.food_item_id === foodItemId);
    orderedQty += items.reduce((sum, i) => sum + i.quantity, 0);
  }

  const totalHeldOrBought = reservedQty + orderedQty;

  if (totalHeldOrBought + requestedQty > env.MAX_ORDER_QUANTITY_PER_USER) {
    const remainingAllowed = Math.max(0, env.MAX_ORDER_QUANTITY_PER_USER - totalHeldOrBought);
    return {
      allowed: false,
      reason: remainingAllowed > 0 
        ? `You already have ${totalHeldOrBought} unit(s). You can only purchase ${remainingAllowed} more unit(s) of this item.`
        : `You have reached the maximum allowed limit of ${env.MAX_ORDER_QUANTITY_PER_USER} units for this surplus item.`
    };
  }

  return { allowed: true };
}

/**
 * Safely reserves inventory for a customer during checkout.
 */
function reserveInventory(foodItemId, customerId, requestedQty) {
  const item = db.findFoodItemById(foodItemId);
  if (!item || !item.is_active) {
    return { success: false, message: 'This food item is no longer available.' };
  }

  // Check purchase limit first
  const limitCheck = checkCustomerPurchaseLimit(customerId, foodItemId, requestedQty);
  if (!limitCheck.allowed) {
    return { success: false, message: limitCheck.reason };
  }

  // Check actual real available quantity accounting for other customers' active reservations
  const activeReservations = db.getActiveReservationsForItem(foodItemId);
  const totalReserved = activeReservations.reduce((sum, r) => sum + r.quantity, 0);
  const actualAvailable = item.available_quantity - totalReserved;

  if (actualAvailable < requestedQty) {
    return {
      success: false,
      message: actualAvailable <= 0 
        ? 'Sorry, this item was just claimed by other customers.' 
        : `Only ${actualAvailable} portion(s) remaining for immediate reservation.`
    };
  }

  // Create temporary reservation
  const reservation = db.createReservation({
    food_item_id: foodItemId,
    customer_id: customerId,
    quantity: requestedQty,
    expires_at: new Date(Date.now() + env.RESERVATION_TIMEOUT_MINUTES * 60 * 1000).toISOString()
  });

  return {
    success: true,
    reservation,
    expiresAt: reservation.expires_at,
    expiresInSeconds: env.RESERVATION_TIMEOUT_MINUTES * 60
  };
}

/**
 * Commits reservation upon successful verified payment, decrementing inventory.
 */
function commitReservation(reservationId) {
  const res = db.reservations.find(r => r.id === reservationId);
  if (!res || res.status !== 'active') {
    return { success: false, message: 'Reservation not found or has already expired.' };
  }

  const item = db.findFoodItemById(res.food_item_id);
  if (!item) {
    return { success: false, message: 'Food item not found.' };
  }

  // Atomic decrement
  const newQty = Math.max(0, item.available_quantity - res.quantity);
  db.updateFoodItem(item.id, {
    available_quantity: newQty,
    is_active: newQty > 0
  });

  // Convert reservation
  db.convertReservation(res.id);

  return { success: true, remainingQuantity: newQty };
}

/**
 * Releases reservation back to available inventory.
 */
function releaseReservation(reservationId) {
  return db.releaseReservation(reservationId);
}

module.exports = {
  checkCustomerPurchaseLimit,
  reserveInventory,
  commitReservation,
  releaseReservation
};
