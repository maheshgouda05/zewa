// backend/controllers/order.controller.js
const { db } = require('../services/supabase.service');
const { calculateDynamicDiscount } = require('../services/discount.service');
const { reserveInventory, releaseReservation } = require('../services/inventory.service');
const { createPaymentSession, verifyAndConfirmOrder, getPaymentSession } = require('../services/payment.service');
const { generateGoogleMapsNavUrl } = require('../services/delivery.service');

function checkoutReserve(req, res) {
  const foodItemId = req.body.foodItemId || req.body.food_item_id;
  const customerId = req.user.id;
  const qty = parseInt(req.body.quantity || '1', 10);

  if (!foodItemId) {
    return res.status(400).json({ success: false, error: 'Food item ID is required.' });
  }

  const reserveResult = reserveInventory(foodItemId, customerId, qty);
  if (!reserveResult.success) {
    return res.status(400).json({ success: false, error: reserveResult.message });
  }

  const foodItem = db.findFoodItemById(foodItemId);
  const restaurant = db.findRestaurantById(foodItem.restaurant_id);
  const pricing = calculateDynamicDiscount(foodItem);

  const totalOriginalAmount = pricing.originalPrice * qty;
  const totalDiscountedAmount = pricing.currentPrice * qty;
  const totalSavings = totalOriginalAmount - totalDiscountedAmount;
  const deliveryFee = 30; // Standard ₹30 hyperlocal delivery fee
  const grandTotal = totalDiscountedAmount + deliveryFee;

  res.status(201).json({
    success: true,
    reservationId: reserveResult.reservation.id,
    reservation: {
      id: reserveResult.reservation.id,
      food_item_id: foodItem.id,
      quantity: qty,
      unit_price: pricing.currentPrice,
      expires_at: reserveResult.expiresAt
    },
    expiresAt: reserveResult.expiresAt,
    expiresInSeconds: reserveResult.expiresInSeconds,
    summary: {
      foodItemId: foodItem.id,
      foodName: foodItem.name,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      quantity: qty,
      unitOriginalPrice: pricing.originalPrice,
      unitDiscountedPrice: pricing.currentPrice,
      unitSavings: pricing.savings,
      discountPercent: pricing.discountPercent,
      totalOriginalAmount,
      totalDiscountedAmount,
      totalSavings,
      deliveryFee,
      grandTotal
    }
  });
}

function initiatePayment(req, res) {
  const reservationId = req.body.reservationId || req.body.reservation_id;
  const amount = req.body.amount || 100;
  const session = createPaymentSession(reservationId, req.user.id, amount);
  res.json({
    success: true,
    payment_id: session.transactionId,
    transactionId: session.transactionId,
    mock_signature: `sig_${session.transactionId}`,
    gateway_order_id: session.transactionId,
    paymentSession: session
  });
}

function verifyAndConfirm(req, res) {
  let reservationId = req.body.reservationId || req.body.reservation_id;
  const transactionId = req.body.transactionId || req.body.payment_id;
  const deliveryAddress = req.body.deliveryAddress || req.body.delivery_address;
  const deliveryLatitude = req.body.deliveryLatitude || req.body.delivery_latitude;
  const deliveryLongitude = req.body.deliveryLongitude || req.body.delivery_longitude;
  const customerPhone = req.body.customerPhone || req.body.customer_phone;
  const specialInstructions = req.body.specialInstructions || req.body.delivery_notes;

  if (!reservationId && transactionId) {
    const session = getPaymentSession(transactionId);
    if (session) {
      reservationId = session.reservationId;
    }
  }

  const reservation = db.reservations.find(r => r.id === reservationId);
  if (!reservation || reservation.status !== 'active') {
    return res.status(400).json({
      success: false,
      error: 'Checkout reservation expired or invalid. Please select your food again.'
    });
  }

  const foodItem = db.findFoodItemById(reservation.food_item_id);
  const restaurant = db.findRestaurantById(foodItem.restaurant_id);
  const pricing = calculateDynamicDiscount(foodItem);

  const qty = reservation.quantity;
  const totalOriginalAmount = pricing.originalPrice * qty;
  const totalDiscountedAmount = pricing.currentPrice * qty;
  const totalSavings = totalOriginalAmount - totalDiscountedAmount;
  const deliveryFee = 30;

  const items = [
    {
      food_item_id: foodItem.id,
      food_name: foodItem.name,
      quantity: qty,
      original_unit_price: pricing.originalPrice,
      purchase_unit_price: pricing.currentPrice,
      discount_percent: pricing.discountPercent,
      total_price: totalDiscountedAmount
    }
  ];

  const result = verifyAndConfirmOrder({
    transactionId: transactionId || `txn_${Date.now()}`,
    reservationId: reservation.id,
    customerId: req.user.id,
    restaurantId: restaurant.id,
    items,
    totalOriginalAmount,
    totalDiscountedAmount,
    totalSavings,
    deliveryFee,
    deliveryAddress: deliveryAddress || '100ft Road, Indiranagar, Bengaluru',
    deliveryLatitude: Number(deliveryLatitude || 12.9716),
    deliveryLongitude: Number(deliveryLongitude || 77.6412),
    customerPhone: customerPhone || req.user.phone || '+91 98765 43210',
    specialInstructions
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.message });
  }

  res.status(201).json({
    success: true,
    order: result.order,
    message: 'Payment verified! Order created and assigned for delivery.'
  });
}

function getCustomerOrders(req, res) {
  const orders = db.getOrders({ customer_id: req.user.id });

  const fullOrders = orders.map(order => {
    const items = db.getOrderItems(order.id);
    const restaurant = db.findRestaurantById(order.restaurant_id);
    const assignment = db.findAssignmentByOrderId(order.id);
    let deliveryPartner = null;
    if (assignment) {
      deliveryPartner = db.findProfileById(assignment.delivery_partner_id);
    }
    return {
      ...order,
      items,
      restaurant,
      assignment,
      deliveryPartner
    };
  });

  res.json({ success: true, count: fullOrders.length, orders: fullOrders });
}

function getOrderTracking(req, res) {
  const { id } = req.params;
  const order = db.findOrderById(id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  // Authorization check: customer, restaurant owner, or assigned delivery partner
  const isCustomer = req.user && req.user.id === order.customer_id;
  const restaurant = db.findRestaurantById(order.restaurant_id);
  const isRestaurantOwner = req.user && restaurant && restaurant.owner_id === req.user.id;
  const assignment = db.findAssignmentByOrderId(order.id);
  const isAssignedPartner = req.user && assignment && assignment.delivery_partner_id === req.user.id;

  if (req.user && !isCustomer && !isRestaurantOwner && !isAssignedPartner) {
    return res.status(403).json({ success: false, error: 'Access denied to this order.' });
  }

  const items = db.getOrderItems(order.id);
  let deliveryPartnerInfo = null;

  if (assignment) {
    const partnerProfile = db.findProfileById(assignment.delivery_partner_id);
    const partnerVehicle = db.findDeliveryPartnerById(assignment.delivery_partner_id);
    if (partnerProfile) {
      deliveryPartnerInfo = {
        name: partnerProfile.full_name,
        phone: partnerProfile.phone,
        vehicle_type: partnerVehicle?.vehicle_type || 'motorcycle',
        vehicle_number: partnerVehicle?.vehicle_number || 'KA-03-EZ-4921',
        rating: partnerVehicle?.rating || 4.9,
        status: assignment.status,
        googleMapsNavUrl: generateGoogleMapsNavUrl(order.delivery_latitude, order.delivery_longitude)
      };
    }
  }

  res.json({
    success: true,
    order: {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
      total_amount: order.total_discounted_amount,
      items,
      restaurant,
      delivery_address: order.delivery_address,
      delivery_partner: deliveryPartnerInfo
    },
    tracking: {
      orderId: order.id,
      orderNumber: order.order_number,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        googleMapsNavUrl: generateGoogleMapsNavUrl(restaurant.latitude, restaurant.longitude)
      },
      deliveryAddress: order.delivery_address,
      items,
      totalDiscountedAmount: order.total_discounted_amount,
      totalSavings: order.total_savings,
      deliveryPartner: deliveryPartnerInfo
    }
  });
}

function cancelOrder(req, res) {
  const { id } = req.params;
  const order = db.findOrderById(id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  if (order.customer_id !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Unauthorized to cancel this order.' });
  }

  if (['ready_for_pickup', 'out_for_delivery', 'delivered'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      error: 'Cannot cancel order once food has been prepared or dispatched.'
    });
  }

  // Restore food quantity
  const items = db.getOrderItems(order.id);
  for (const item of items) {
    const food = db.findFoodItemById(item.food_item_id);
    if (food) {
      db.updateFoodItem(food.id, {
        available_quantity: food.available_quantity + item.quantity,
        is_active: true
      });
    }
  }

  db.updateOrderStatus(order.id, 'cancelled', req.user.id, 'Cancelled by customer.');

  res.json({ success: true, message: 'Order cancelled successfully and refund initiated.' });
}

module.exports = {
  checkoutReserve,
  initiatePayment,
  verifyAndConfirm,
  getCustomerOrders,
  getOrderTracking,
  cancelOrder
};
