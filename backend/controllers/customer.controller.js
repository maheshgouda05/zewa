// backend/controllers/customer.controller.js
const { db } = require('../services/supabase.service');
const { calculateDynamicDiscount } = require('../services/discount.service');
const { calculateDistanceKm } = require('../services/delivery.service');
const { checkCustomerPurchaseLimit } = require('../services/inventory.service');

function getNearbySurplusFood(req, res) {
  const customerLat = Number(req.query.lat || 12.9716);
  const customerLng = Number(req.query.lng || 77.6412);
  const category = req.query.category || 'all';
  const diet = req.query.diet || 'all';
  const search = (req.query.search || '').trim().toLowerCase();
  const sortBy = req.query.sortBy || 'discount_desc'; // discount_desc, distance_asc, price_asc, time_asc
  const maxDistanceKm = Number(req.query.maxDistance || 15);

  const restaurants = db.getRestaurants();
  const restMap = new Map(restaurants.map(r => [r.id, r]));

  const rawItems = db.getFoodItems();
  const processedItems = [];

  for (const item of rawItems) {
    const restaurant = restMap.get(item.restaurant_id);
    if (!restaurant) continue;

    const distanceKm = calculateDistanceKm(
      customerLat,
      customerLng,
      restaurant.latitude,
      restaurant.longitude
    );

    if (distanceKm > maxDistanceKm) continue;

    // Filter category
    if (category !== 'all' && item.category.toLowerCase() !== category.toLowerCase()) {
      continue;
    }

    // Filter dietary
    if (diet !== 'all' && item.dietary_type !== diet) {
      continue;
    }

    // Filter search query
    if (search) {
      const matchName = item.name.toLowerCase().includes(search);
      const matchDesc = (item.description || '').toLowerCase().includes(search);
      const matchRest = restaurant.name.toLowerCase().includes(search);
      if (!matchName && !matchDesc && !matchRest) continue;
    }

    // Calculate real-time dynamic discount
    const pricing = calculateDynamicDiscount(item);

    // Only show available, unexpired food in live marketplace
    if (!pricing.isAvailable) continue;

    // Check customer purchase limit if logged in
    let purchaseLimitInfo = { allowed: true, maxAllowed: 2 };
    if (req.user) {
      purchaseLimitInfo = checkCustomerPurchaseLimit(req.user.id, item.id, 1);
    }

    processedItems.push({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      dietary_type: item.dietary_type,
      is_veg: item.dietary_type === 'veg',
      original_price: item.original_price,
      starting_price: item.starting_price,
      min_price: item.min_price,
      image_url: item.image_url,
      available_quantity: item.available_quantity,
      freshness_info: item.freshness_info,
      freshness_notes: item.freshness_info,
      expiry_time: item.expiry_time,
      distance_km: distanceKm,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        type: restaurant.type,
        address: restaurant.address,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        phone: restaurant.phone,
        opening_time: restaurant.opening_time,
        closing_time: restaurant.closing_time,
        distance_km: distanceKm
      },
      pricing,
      purchaseLimit: purchaseLimitInfo
    });
  }

  // Sorting
  processedItems.sort((a, b) => {
    if (sortBy === 'distance_asc') {
      return a.restaurant.distance_km - b.restaurant.distance_km;
    }
    if (sortBy === 'price_asc') {
      return a.pricing.currentPrice - b.pricing.currentPrice;
    }
    if (sortBy === 'time_asc') {
      return a.pricing.timeRemainingSeconds - b.pricing.timeRemainingSeconds;
    }
    // Default: highest discount percentage
    return b.pricing.discountPercent - a.pricing.discountPercent;
  });

  res.json({
    success: true,
    count: processedItems.length,
    items: processedItems,
    customerLocation: { latitude: customerLat, longitude: customerLng }
  });
}

function getFoodItemDetails(req, res) {
  const { id } = req.params;
  const item = db.findFoodItemById(id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Food item not found.' });
  }

  const restaurant = db.findRestaurantById(item.restaurant_id);
  const pricing = calculateDynamicDiscount(item);

  let purchaseLimitInfo = { allowed: true };
  if (req.user) {
    purchaseLimitInfo = checkCustomerPurchaseLimit(req.user.id, item.id, 1);
  }

  res.json({
    success: true,
    item: {
      ...item,
      pricing,
      restaurant,
      purchaseLimit: purchaseLimitInfo
    }
  });
}

module.exports = {
  getNearbySurplusFood,
  getFoodItemDetails
};
