// backend/controllers/delivery.controller.js
const { db } = require('../services/supabase.service');
const { generateGoogleMapsNavUrl, calculateDistanceKm } = require('../services/delivery.service');

function getDeliveryDashboard(req, res) {
  const partnerId = req.user.id;
  const partner = db.findDeliveryPartnerById(partnerId);
  if (!partner) {
    return res.status(404).json({ success: false, error: 'Delivery partner record not found.' });
  }

  const assignments = db.findAssignmentsForPartner(partnerId);
  const activeAssignment = assignments.find(a => ['assigned', 'accepted', 'picked_up'].includes(a.status));

  let activeOrderDetails = null;
  if (activeAssignment) {
    const order = db.findOrderById(activeAssignment.order_id);
    const restaurant = db.findRestaurantById(order.restaurant_id);
    const items = db.getOrderItems(order.id);
    const customer = db.findProfileById(order.customer_id);

    activeOrderDetails = {
      assignmentId: activeAssignment.id,
      assignmentStatus: activeAssignment.status,
      orderId: order.id,
      orderNumber: order.order_number,
      orderStatus: order.status,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        mapsNavUrl: generateGoogleMapsNavUrl(restaurant.latitude, restaurant.longitude)
      },
      customer: {
        name: customer ? customer.full_name : 'Customer',
        phone: order.customer_phone,
        deliveryAddress: order.delivery_address,
        latitude: order.delivery_latitude,
        longitude: order.delivery_longitude,
        mapsNavUrl: generateGoogleMapsNavUrl(order.delivery_latitude, order.delivery_longitude)
      },
      items,
      totalAmount: order.total_discounted_amount,
      deliveryEarnings: 40 // ₹40 partner delivery payout per order
    };
  }

  const completedAssignments = assignments.filter(a => a.status === 'delivered');
  const totalEarnings = completedAssignments.length * 40;

  res.json({
    success: true,
    partner,
    active_assignment: activeAssignment ? {
      id: activeAssignment.id,
      status: activeAssignment.status,
      order: db.findOrderById(activeAssignment.order_id)
    } : null,
    stats: {
      isOnline: partner.is_online,
      isBusy: partner.is_busy,
      totalCompleted: completedAssignments.length,
      totalEarnings,
      rating: partner.rating
    },
    activeAssignment: activeOrderDetails,
    history: completedAssignments.map(a => {
      const order = db.findOrderById(a.order_id);
      return {
        assignmentId: a.id,
        orderId: a.order_id,
        orderNumber: order ? order.order_number : '',
        deliveredAt: a.delivered_at,
        payout: 40
      };
    })
  });
}

function toggleOnlineStatus(req, res) {
  const partnerId = req.user.id;
  const { isOnline } = req.body;

  const updated = db.updateDeliveryPartner(partnerId, {
    is_online: Boolean(isOnline)
  });

  res.json({
    success: true,
    isOnline: updated.is_online,
    message: updated.is_online ? 'You are now ONLINE and ready for orders.' : 'You are now OFFLINE.'
  });
}

function updateLocation(req, res) {
  const partnerId = req.user.id;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, error: 'Valid latitude and longitude required.' });
  }

  const updated = db.updateDeliveryPartner(partnerId, {
    current_latitude: Number(latitude),
    current_longitude: Number(longitude)
  });

  res.json({
    success: true,
    currentLocation: {
      latitude: updated.current_latitude,
      longitude: updated.current_longitude
    }
  });
}

function acceptAssignment(req, res) {
  const { assignmentId } = req.params;
  const assignment = db.deliveryAssignments.find(a => a.id === assignmentId && a.delivery_partner_id === req.user.id);
  
  if (!assignment) {
    return res.status(404).json({ success: false, error: 'Assignment not found.' });
  }

  db.updateAssignmentStatus(assignment.id, 'accepted');
  db.updateDeliveryPartner(req.user.id, { is_busy: true });
  db.updateOrderStatus(assignment.order_id, 'preparing', req.user.id, 'Delivery partner accepted assignment and is heading to restaurant.');

  res.json({
    success: true,
    assignment: { id: assignment.id, status: 'accepted' },
    message: 'Assignment accepted! Navigate to the restaurant for pickup.'
  });
}

function rejectAssignment(req, res) {
  const { assignmentId } = req.params;
  const assignment = db.deliveryAssignments.find(a => a.id === assignmentId && a.delivery_partner_id === req.user.id);

  if (!assignment) {
    return res.status(404).json({ success: false, error: 'Assignment not found.' });
  }

  db.updateAssignmentStatus(assignment.id, 'rejected');
  db.updateDeliveryPartner(req.user.id, { is_busy: false });

  // Re-assign order to another partner
  const order = db.findOrderById(assignment.order_id);
  if (order) {
    const { assignDeliveryPartnerToOrder } = require('../services/delivery.service');
    assignDeliveryPartnerToOrder(order);
  }

  res.json({
    success: true,
    assignment: { id: assignment.id, status: 'rejected' },
    message: 'Assignment rejected. Searching for alternative partner.'
  });
}

function markOrderPickedUp(req, res) {
  const { assignmentId } = req.params;
  const assignment = db.deliveryAssignments.find(a => a.id === assignmentId && a.delivery_partner_id === req.user.id);

  if (!assignment) {
    return res.status(404).json({ success: false, error: 'Assignment not found.' });
  }

  db.updateAssignmentStatus(assignment.id, 'picked_up');
  db.updateOrderStatus(assignment.order_id, 'out_for_delivery', req.user.id, 'Food collected from restaurant. Out for delivery to customer.');

  const order = db.findOrderById(assignment.order_id);

  res.json({
    success: true,
    assignment: { id: assignment.id, status: 'picked_up' },
    message: 'Food picked up! Navigate to the customer address.',
    customerNavUrl: generateGoogleMapsNavUrl(order.delivery_latitude, order.delivery_longitude)
  });
}

function markOrderDelivered(req, res) {
  const { assignmentId } = req.params;
  const assignment = db.deliveryAssignments.find(a => a.id === assignmentId && a.delivery_partner_id === req.user.id);

  if (!assignment) {
    return res.status(404).json({ success: false, error: 'Assignment not found.' });
  }

  db.updateAssignmentStatus(assignment.id, 'delivered');
  db.updateOrderStatus(assignment.order_id, 'delivered', req.user.id, 'Order safely delivered to customer doorstep.');
  db.updateDeliveryPartner(req.user.id, {
    is_busy: false,
    total_deliveries: (db.findDeliveryPartnerById(req.user.id)?.total_deliveries || 0) + 1
  });

  res.json({
    success: true,
    assignment: { id: assignment.id, status: 'completed' },
    message: 'Order marked delivered! ₹40 earnings credited to your balance.'
  });
}

function respondAssignment(req, res) {
  const { action } = req.body;
  if (action === 'accept') {
    return acceptAssignment(req, res);
  }
  return rejectAssignment(req, res);
}

function stepAssignment(req, res) {
  const { action } = req.body;
  if (action === 'pickup') {
    return markOrderPickedUp(req, res);
  }
  return markOrderDelivered(req, res);
}

function updateStatus(req, res) {
  const { is_online, lat, lng } = req.body;
  const partnerId = req.user.id;
  if (is_online !== undefined) {
    db.updateDeliveryPartner(partnerId, { is_online: Boolean(is_online) });
  }
  if (lat && lng) {
    db.updateDeliveryPartner(partnerId, { current_latitude: Number(lat), current_longitude: Number(lng) });
  }
  res.json({ success: true, message: 'Status updated' });
}

module.exports = {
  getDeliveryDashboard,
  toggleOnlineStatus,
  updateLocation,
  updateStatus,
  acceptAssignment,
  rejectAssignment,
  respondAssignment,
  markOrderPickedUp,
  markOrderDelivered,
  stepAssignment
};
