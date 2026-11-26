// backend/controllers/restaurant.controller.js
const { db } = require('../services/supabase.service');
const { calculateDynamicDiscount } = require('../services/discount.service');

function getRestaurantDashboard(req, res) {
  const restaurant = db.findRestaurantByOwnerId(req.user.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, error: 'Restaurant profile not found for this account.' });
  }

  const items = db.getFoodItems(restaurant.id);
  const itemsWithPricing = items.map(item => ({
    ...item,
    pricing: calculateDynamicDiscount(item)
  }));

  const orders = db.getOrders({ restaurant_id: restaurant.id });
  const activeOrders = orders.filter(o => ['confirmed', 'preparing', 'ready_for_pickup'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');

  const totalSalesRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total_discounted_amount), 0);
  const totalMealsRescued = completedOrders.reduce((sum, o) => {
    const orderItems = db.getOrderItems(o.id);
    return sum + orderItems.reduce((iSum, i) => iSum + i.quantity, 0);
  }, 0);

  res.json({
    success: true,
    restaurant,
    stats: {
      active_items: items.filter(i => i.is_active && i.available_quantity > 0).length,
      activeFoodCount: items.filter(i => i.is_active && i.available_quantity > 0).length,
      incomingOrdersCount: activeOrders.length,
      completedOrdersCount: completedOrders.length,
      totalSalesRevenue,
      total_revenue: totalSalesRevenue,
      portions_rescued: totalMealsRescued,
      waste_prevented_kg: Math.round(totalMealsRescued * 0.45),
      totalMealsRescued
    },
    items: itemsWithPricing,
    inventory: itemsWithPricing,
    orders: orders.map(o => ({
      ...o,
      items: db.getOrderItems(o.id),
      deliveryAssignment: db.findAssignmentByOrderId(o.id)
    })),
    incomingOrders: activeOrders.map(o => ({
      ...o,
      items: db.getOrderItems(o.id),
      deliveryAssignment: db.findAssignmentByOrderId(o.id)
    }))
  });
}

function addFoodListing(req, res) {
  const restaurant = db.findRestaurantByOwnerId(req.user.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, error: 'Restaurant not found.' });
  }

  const {
    name,
    description,
    category,
    dietary_type,
    image_url,
    original_price,
    starting_price,
    min_price,
    available_quantity,
    freshness_info,
    expiry_time
  } = req.body;

  const origPrice = Number(original_price);
  const startPrice = Number(starting_price || origPrice * 0.7);
  const minimumPrice = Number(min_price || origPrice * 0.3);
  const qty = parseInt(available_quantity, 10);

  if (!name || isNaN(origPrice) || origPrice <= 0 || isNaN(qty) || qty < 0) {
    return res.status(400).json({ success: false, error: 'Name, valid original price, and quantity are required.' });
  }

  if (minimumPrice > startPrice || startPrice > origPrice) {
    return res.status(400).json({
      success: false,
      error: 'Invalid price boundaries: Minimum price must be <= Starting price <= Original price.'
    });
  }

  // Calculate default expiry (e.g. restaurant closing time today or 3 hours ahead)
  let validExpiry = expiry_time;
  if (!validExpiry) {
    const now = new Date();
    validExpiry = new Date(now.getTime() + 3 * 3600 * 1000).toISOString();
  }

  const newItem = db.createFoodItem({
    restaurant_id: restaurant.id,
    name,
    description: description || '',
    category: category || 'Meals',
    dietary_type: dietary_type || 'veg',
    image_url: image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    original_price: origPrice,
    starting_price: startPrice,
    min_price: minimumPrice,
    max_discount_percent: Math.round(((origPrice - minimumPrice) / origPrice) * 100),
    available_quantity: qty,
    freshness_info: freshness_info || 'Freshly cooked surplus batch',
    expiry_time: validExpiry
  });

  res.status(201).json({
    success: true,
    item: {
      ...newItem,
      pricing: calculateDynamicDiscount(newItem)
    },
    message: 'Surplus food item published successfully!'
  });
}

function updateFoodListing(req, res) {
  const { id } = req.params;
  const item = db.findFoodItemById(id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Food item not found.' });
  }

  const restaurant = db.findRestaurantByOwnerId(req.user.id);
  if (!restaurant || item.restaurant_id !== restaurant.id) {
    return res.status(403).json({ success: false, error: 'Unauthorized to edit this item.' });
  }

  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.available_quantity !== undefined) {
    updates.available_quantity = Math.max(0, parseInt(req.body.available_quantity, 10));
    updates.is_active = updates.available_quantity > 0;
  }
  if (req.body.is_active !== undefined) updates.is_active = Boolean(req.body.is_active);
  if (req.body.expiry_time) updates.expiry_time = req.body.expiry_time;

  const updated = db.updateFoodItem(id, updates);

  res.json({
    success: true,
    item: {
      ...updated,
      pricing: calculateDynamicDiscount(updated)
    },
    message: 'Listing updated.'
  });
}

function updateOrderStatus(req, res) {
  const { orderId } = req.params;
  const { status } = req.body; // 'preparing' | 'ready_for_pickup'

  const order = db.findOrderById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  const restaurant = db.findRestaurantByOwnerId(req.user.id);
  if (!restaurant || order.restaurant_id !== restaurant.id) {
    return res.status(403).json({ success: false, error: 'Unauthorized to update this order.' });
  }

  if (!['preparing', 'ready_for_pickup'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status for restaurant action.' });
  }

  const updatedOrder = db.updateOrderStatus(order.id, status, req.user.id, `Status updated to ${status} by restaurant`);

  res.json({
    success: true,
    order: updatedOrder,
    message: `Order status updated to "${status}".`
  });
}

function deleteFoodListing(req, res) {
  const { id } = req.params;
  const restaurant = db.findRestaurantByOwnerId(req.user.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, error: 'Restaurant not found.' });
  }

  const item = db.findFoodItemById(id);
  if (!item || item.restaurant_id !== restaurant.id) {
    return res.status(404).json({ success: false, error: 'Food item not found or not owned by you.' });
  }

  db.deleteFoodItem(id);
  res.json({ success: true, message: 'Food item removed.' });
}

module.exports = {
  getRestaurantDashboard,
  addFoodListing,
  updateFoodListing,
  deleteFoodListing,
  updateOrderStatus
};
