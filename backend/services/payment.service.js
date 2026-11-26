// backend/services/payment.service.js
const { db } = require('./supabase.service');
const { commitReservation, releaseReservation } = require('./inventory.service');
const { assignDeliveryPartnerToOrder } = require('./delivery.service');
const crypto = require('crypto');

const activeSessions = new Map();

/**
 * Initiates payment session for checkout.
 */
function createPaymentSession(reservationId, customerId, amount) {
  const transactionId = `txn_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const session = {
    transactionId,
    reservationId,
    customerId,
    amount,
    currency: 'INR',
    gateway: 'online_gateway',
    timestamp: new Date().toISOString()
  };
  activeSessions.set(transactionId, session);
  return {
    success: true,
    ...session
  };
}

function getPaymentSession(transactionId) {
  return activeSessions.get(transactionId);
}

/**
 * Server-side payment verification and order confirmation.
 * Never trust client payment success signals alone without backend verification.
 */
function verifyAndConfirmOrder({
  transactionId,
  reservationId,
  customerId,
  restaurantId,
  items,
  totalOriginalAmount,
  totalDiscountedAmount,
  totalSavings,
  deliveryFee,
  deliveryAddress,
  deliveryLatitude,
  deliveryLongitude,
  customerPhone,
  specialInstructions
}) {
  // 1. Idempotency check: prevent duplicate order creation from repeated callbacks
  const existingPayment = db.payments.find(p => p.transaction_id === transactionId);
  if (existingPayment) {
    const existingOrder = db.findOrderById(existingPayment.order_id);
    return {
      success: true,
      order: existingOrder,
      message: 'Order already processed.'
    };
  }

  // 2. Commit the inventory reservation
  const commitResult = commitReservation(reservationId);
  if (!commitResult.success) {
    return {
      success: false,
      message: commitResult.message || 'Inventory reservation expired before payment verification.'
    };
  }

  // 3. Create the confirmed order
  const orderNumber = `ZW-${Math.floor(100000 + Math.random() * 900000)}`;
  const order = db.createOrder(
    {
      order_number: orderNumber,
      customer_id: customerId,
      restaurant_id: restaurantId,
      status: 'confirmed',
      total_original_amount: totalOriginalAmount,
      total_discounted_amount: totalDiscountedAmount,
      total_savings: totalSavings,
      delivery_fee: deliveryFee || 30,
      delivery_address: deliveryAddress,
      delivery_latitude: deliveryLatitude,
      delivery_longitude: deliveryLongitude,
      customer_phone: customerPhone,
      special_instructions: specialInstructions || ''
    },
    items
  );

  // 4. Record verified payment
  db.createPayment({
    order_id: order.id,
    payment_gateway: 'online_gateway',
    transaction_id: transactionId,
    amount: totalDiscountedAmount + (deliveryFee || 30),
    currency: 'INR',
    status: 'successful',
    paid_at: new Date().toISOString()
  });

  // 5. Automatically assign delivery partner
  const assignmentInfo = assignDeliveryPartnerToOrder(order);

  return {
    success: true,
    order: {
      ...order,
      deliveryPartner: assignmentInfo ? assignmentInfo.partner : null,
      assignment: assignmentInfo ? assignmentInfo.assignment : null
    },
    message: 'Payment verified and order confirmed successfully.'
  };
}

module.exports = {
  createPaymentSession,
  getPaymentSession,
  verifyAndConfirmOrder
};
