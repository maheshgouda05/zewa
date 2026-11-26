// backend/services/supabase.service.js
const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

let supabaseClient = null;
const isSupabaseConfigured = Boolean(
  env.SUPABASE_URL && 
  env.SUPABASE_ANON_KEY && 
  !env.SUPABASE_URL.includes('your-project-id')
);

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY);
    console.log('[Supabase] Successfully connected to live Supabase project:', env.SUPABASE_URL);
  } catch (err) {
    console.error('[Supabase] Error initializing client, using resilient local storage:', err.message);
  }
} else {
  console.log('[Database] Supabase credentials pending in .env. Running with resilient local memory engine.');
}

// ----------------------------------------------------------------------------
// SEED DATA FOR LOCAL / DEV ENGINE
// ----------------------------------------------------------------------------
const SEED_PROFILES = [
  {
    id: 'user-cust-1',
    role: 'customer',
    full_name: 'Aarav Sharma',
    email: 'customer@zewa.in',
    phone: '+91 98765 43210',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-rest-1',
    role: 'restaurant',
    full_name: 'Ramesh Gowda',
    email: 'greenbistro@zewa.in',
    phone: '+91 98451 23456',
    avatar_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-rest-2',
    role: 'restaurant',
    full_name: 'Suresh Kumar',
    email: 'krishnacart@zewa.in',
    phone: '+91 98452 34567',
    avatar_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=160&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-delivery-1',
    role: 'delivery_partner',
    full_name: 'Karthik Raja',
    email: 'delivery@zewa.in',
    phone: '+91 98860 12345',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    created_at: new Date().toISOString()
  }
];

const SEED_RESTAURANTS = [
  {
    id: 'rest-1',
    owner_id: 'user-rest-1',
    name: 'The Green Bistro & Restaurant',
    type: 'restaurant',
    address: '100ft Road, Indiranagar, Bengaluru',
    latitude: 12.9716,
    longitude: 77.6412,
    opening_time: '11:00:00',
    closing_time: '22:30:00',
    phone: '+91 98451 23456',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'rest-2',
    owner_id: 'user-rest-2',
    name: 'Sri Krishna Tiffin Cart',
    type: 'food_cart',
    address: 'Near Indiranagar Metro, CMH Road, Bengaluru',
    latitude: 12.9784,
    longitude: 77.6408,
    opening_time: '07:00:00',
    closing_time: '21:30:00',
    phone: '+91 98452 34567',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'rest-3',
    owner_id: 'user-rest-1',
    name: 'Sunrise Artisan Bakery & Cafe',
    type: 'bakery',
    address: '12th Main Road, Indiranagar, Bengaluru',
    latitude: 12.9698,
    longitude: 77.6435,
    opening_time: '08:00:00',
    closing_time: '21:00:00',
    phone: '+91 98234 56789',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Today's closing times dynamically set to 1-3 hours in future for realistic countdown demos
const now = new Date();
const closingTonight = new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString();
const closingSooner = new Date(now.getTime() + 50 * 60 * 1000).toISOString(); // 50 mins

const SEED_FOOD_ITEMS = [
  {
    id: 'food-1',
    restaurant_id: 'rest-2',
    name: 'Masala Dosa & Podi Idli Combo',
    description: 'Crisp golden masala dosa with potato roast masala, 2 mini ghee podi idlis, coconut chutney, and piping hot drumstick sambar.',
    category: 'Tiffin',
    dietary_type: 'veg',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    original_price: 180,
    starting_price: 110,
    min_price: 55,
    max_discount_percent: 70,
    available_quantity: 6,
    freshness_info: 'Prepared fresh at 8:00 PM evening batch',
    expiry_time: closingTonight,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'food-2',
    restaurant_id: 'rest-1',
    name: 'Royal Vegetable Dum Biryani Box',
    description: 'Slow-cooked fragrant basmati rice with farm-fresh vegetables, saffron, aromatic whole spices, served with cucumber raitha and mirchi ka salan.',
    category: 'Meals',
    dietary_type: 'veg',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    original_price: 240,
    starting_price: 140,
    min_price: 75,
    max_discount_percent: 68,
    available_quantity: 4,
    freshness_info: 'Fresh dinner handi batch, kept hot in warming container',
    expiry_time: closingSooner,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'food-3',
    restaurant_id: 'rest-3',
    name: 'French Butter Croissants & Danish Box (Pack of 3)',
    description: 'Flaky 100% butter French croissants and cinnamon apple Danish pastries baked fresh this morning, hygienically packed.',
    category: 'Bakery',
    dietary_type: 'veg',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    original_price: 220,
    starting_price: 120,
    min_price: 65,
    max_discount_percent: 70,
    available_quantity: 5,
    freshness_info: 'Morning artisan bake, sealed in kraft pastry box',
    expiry_time: closingTonight,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'food-4',
    restaurant_id: 'rest-1',
    name: 'Tawa Paneer Butter Masala with 3 Phulkas',
    description: 'Cottage cheese cubes tossed in rich tomato-cashew gravy with whole wheat tawa phulkas, sliced onions, and mint dip.',
    category: 'Meals',
    dietary_type: 'veg',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    original_price: 210,
    starting_price: 125,
    min_price: 69,
    max_discount_percent: 67,
    available_quantity: 3,
    freshness_info: 'Hot dinner portion prepared at 8:30 PM',
    expiry_time: closingTonight,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'food-5',
    restaurant_id: 'rest-3',
    name: 'Gulab Jamun & Belgian Chocolate Mousse',
    description: 'Dessert duo: 2 soft mawa gulab jamuns in green cardamom syrup paired with a jar of dark Belgian chocolate mousse.',
    category: 'Desserts',
    dietary_type: 'veg',
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    original_price: 160,
    starting_price: 99,
    min_price: 49,
    max_discount_percent: 70,
    available_quantity: 5,
    freshness_info: 'Refrigerated sweet counter batch',
    expiry_time: closingTonight,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const SEED_DELIVERY_PARTNERS = [
  {
    id: 'user-delivery-1',
    vehicle_type: 'motorcycle',
    vehicle_number: 'KA-03-EZ-4921',
    current_latitude: 12.9730,
    current_longitude: 77.6420,
    is_online: true,
    is_busy: false,
    rating: 4.95,
    total_deliveries: 142,
    last_active_at: new Date().toISOString()
  }
];

// Resilient In-Memory DB
class LocalDatabase {
  constructor() {
    this.profiles = [...SEED_PROFILES];
    this.restaurants = [...SEED_RESTAURANTS];
    this.foodItems = [...SEED_FOOD_ITEMS];
    this.deliveryPartners = [...SEED_DELIVERY_PARTNERS];
    this.reservations = [];
    this.orders = [];
    this.orderItems = [];
    this.payments = [];
    this.deliveryAssignments = [];
    this.customerRestrictions = [];
    this.orderStatusHistory = [];
  }

  // --- Profile methods ---
  findProfileByEmail(email) {
    return this.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  findProfileById(id) {
    return this.profiles.find(p => p.id === id);
  }

  createProfile(profile) {
    const newProfile = {
      id: profile.id || `user-${Date.now()}`,
      role: profile.role,
      full_name: profile.full_name || profile.fullName,
      email: profile.email,
      phone: profile.phone || '',
      avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      created_at: new Date().toISOString()
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  // --- Restaurant methods ---
  getRestaurants() {
    return this.restaurants.filter(r => r.is_active);
  }

  findRestaurantById(id) {
    return this.restaurants.find(r => r.id === id);
  }

  findRestaurantByOwnerId(ownerId) {
    return this.restaurants.find(r => r.owner_id === ownerId);
  }

  createRestaurant(rest) {
    const newRest = {
      id: `rest-${Date.now()}`,
      owner_id: rest.owner_id,
      name: rest.name,
      type: rest.type || 'restaurant',
      address: rest.address,
      latitude: Number(rest.latitude || 12.9716),
      longitude: Number(rest.longitude || 77.6412),
      opening_time: rest.opening_time || '10:00:00',
      closing_time: rest.closing_time || '22:00:00',
      phone: rest.phone,
      image_url: rest.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.restaurants.push(newRest);
    return newRest;
  }

  updateRestaurant(id, updates) {
    const idx = this.restaurants.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.restaurants[idx] = { ...this.restaurants[idx], ...updates, updated_at: new Date().toISOString() };
      return this.restaurants[idx];
    }
    return null;
  }

  // --- Food Items methods ---
  getFoodItems(restaurantId = null) {
    let items = this.foodItems.filter(f => f.is_active);
    if (restaurantId) {
      items = items.filter(f => f.restaurant_id === restaurantId);
    }
    return items;
  }

  findFoodItemById(id) {
    return this.foodItems.find(f => f.id === id);
  }

  createFoodItem(item) {
    const newItem = {
      id: `food-${Date.now()}`,
      restaurant_id: item.restaurant_id,
      name: item.name,
      description: item.description,
      category: item.category || 'Meals',
      dietary_type: item.dietary_type || 'veg',
      image_url: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      original_price: Number(item.original_price),
      starting_price: Number(item.starting_price || item.original_price * 0.7),
      min_price: Number(item.min_price || item.original_price * 0.3),
      max_discount_percent: Number(item.max_discount_percent || 75),
      available_quantity: Number(item.available_quantity),
      freshness_info: item.freshness_info || 'Fresh surplus batch',
      expiry_time: item.expiry_time || new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.foodItems.unshift(newItem);
    return newItem;
  }

  updateFoodItem(id, updates) {
    const idx = this.foodItems.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.foodItems[idx] = { ...this.foodItems[idx], ...updates, updated_at: new Date().toISOString() };
      return this.foodItems[idx];
    }
    return null;
  }

  deleteFoodItem(id) {
    const idx = this.foodItems.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.foodItems[idx].is_active = false;
      return true;
    }
    return false;
  }

  // --- Reservations methods ---
  getActiveReservationsForItem(foodItemId) {
    const nowTime = new Date().getTime();
    return this.reservations.filter(r => 
      r.food_item_id === foodItemId && 
      r.status === 'active' && 
      new Date(r.expires_at).getTime() > nowTime
    );
  }

  getActiveCustomerReservations(customerId, foodItemId) {
    const nowTime = new Date().getTime();
    return this.reservations.filter(r => 
      r.customer_id === customerId &&
      r.food_item_id === foodItemId &&
      r.status === 'active' &&
      new Date(r.expires_at).getTime() > nowTime
    );
  }

  createReservation(reservation) {
    const newRes = {
      id: `res-${Date.now()}`,
      food_item_id: reservation.food_item_id,
      customer_id: reservation.customer_id,
      quantity: reservation.quantity,
      reserved_at: new Date().toISOString(),
      expires_at: reservation.expires_at || new Date(Date.now() + env.RESERVATION_TIMEOUT_MINUTES * 60 * 1000).toISOString(),
      status: 'active'
    };
    this.reservations.push(newRes);
    return newRes;
  }

  releaseReservation(id) {
    const res = this.reservations.find(r => r.id === id);
    if (res && res.status === 'active') {
      res.status = 'released';
      return true;
    }
    return false;
  }

  convertReservation(id) {
    const res = this.reservations.find(r => r.id === id);
    if (res && res.status === 'active') {
      res.status = 'converted';
      return true;
    }
    return false;
  }

  // --- Orders methods ---
  getOrders(filter = {}) {
    let list = [...this.orders];
    if (filter.customer_id) {
      list = list.filter(o => o.customer_id === filter.customer_id);
    }
    if (filter.restaurant_id) {
      list = list.filter(o => o.restaurant_id === filter.restaurant_id);
    }
    if (filter.status) {
      list = list.filter(o => o.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  findOrderById(id) {
    return this.orders.find(o => o.id === id || o.order_number === id);
  }

  createOrder(orderData, itemsData) {
    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: orderData.order_number || `ZW-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: orderData.customer_id,
      restaurant_id: orderData.restaurant_id,
      status: orderData.status || 'confirmed',
      total_original_amount: Number(orderData.total_original_amount),
      total_discounted_amount: Number(orderData.total_discounted_amount),
      total_savings: Number(orderData.total_savings),
      delivery_fee: Number(orderData.delivery_fee || 30),
      delivery_address: orderData.delivery_address,
      delivery_latitude: Number(orderData.delivery_latitude || 12.9716),
      delivery_longitude: Number(orderData.delivery_longitude || 77.6412),
      customer_phone: orderData.customer_phone,
      special_instructions: orderData.special_instructions || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.orders.unshift(newOrder);

    // Save order items
    const savedItems = itemsData.map(item => ({
      id: `oi-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      order_id: newOrder.id,
      food_item_id: item.food_item_id,
      food_name: item.food_name,
      quantity: Number(item.quantity),
      original_unit_price: Number(item.original_unit_price),
      purchase_unit_price: Number(item.purchase_unit_price),
      discount_percent: Number(item.discount_percent),
      total_price: Number(item.total_price)
    }));

    this.orderItems.push(...savedItems);

    // Audit history entry
    this.orderStatusHistory.push({
      id: `osh-${Date.now()}`,
      order_id: newOrder.id,
      status: newOrder.status,
      changed_by_profile_id: newOrder.customer_id,
      note: 'Order confirmed with successful payment',
      created_at: new Date().toISOString()
    });

    return { ...newOrder, items: savedItems };
  }

  getOrderItems(orderId) {
    return this.orderItems.filter(oi => oi.order_id === orderId);
  }

  updateOrderStatus(orderId, newStatus, changedByProfileId = null, note = '') {
    const order = this.findOrderById(orderId);
    if (!order) return null;

    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    this.orderStatusHistory.push({
      id: `osh-${Date.now()}`,
      order_id: order.id,
      status: newStatus,
      changed_by_profile_id: changedByProfileId,
      note,
      created_at: new Date().toISOString()
    });

    return order;
  }

  // --- Payment methods ---
  createPayment(paymentData) {
    const newPayment = {
      id: `pay-${Date.now()}`,
      order_id: paymentData.order_id,
      payment_gateway: paymentData.payment_gateway || 'online_gateway',
      transaction_id: paymentData.transaction_id || `txn_${Date.now()}`,
      amount: Number(paymentData.amount),
      currency: paymentData.currency || 'INR',
      status: paymentData.status || 'successful',
      gateway_response: paymentData.gateway_response || {},
      paid_at: paymentData.paid_at || new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  // --- Delivery Partner methods ---
  getDeliveryPartners() {
    return this.deliveryPartners;
  }

  findDeliveryPartnerById(id) {
    return this.deliveryPartners.find(dp => dp.id === id);
  }

  updateDeliveryPartner(id, updates) {
    let dp = this.findDeliveryPartnerById(id);
    if (!dp) {
      // Auto-register partner profile if not yet in partner table
      dp = {
        id,
        vehicle_type: updates.vehicle_type || 'motorcycle',
        vehicle_number: updates.vehicle_number || 'KA-01-AB-1234',
        current_latitude: Number(updates.current_latitude || 12.9716),
        current_longitude: Number(updates.current_longitude || 77.6412),
        is_online: updates.is_online !== undefined ? updates.is_online : true,
        is_busy: updates.is_busy !== undefined ? updates.is_busy : false,
        rating: 5.0,
        total_deliveries: 0,
        last_active_at: new Date().toISOString()
      };
      this.deliveryPartners.push(dp);
      return dp;
    }
    Object.assign(dp, updates, { last_active_at: new Date().toISOString() });
    return dp;
  }

  createDeliveryAssignment(orderId, partnerId) {
    const assignment = {
      id: `asgn-${Date.now()}`,
      order_id: orderId,
      delivery_partner_id: partnerId,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    };
    this.deliveryAssignments.push(assignment);
    return assignment;
  }

  findAssignmentByOrderId(orderId) {
    return this.deliveryAssignments.find(a => a.order_id === orderId);
  }

  findAssignmentsForPartner(partnerId) {
    return this.deliveryAssignments.filter(a => a.delivery_partner_id === partnerId);
  }

  updateAssignmentStatus(assignmentId, newStatus) {
    const asgn = this.deliveryAssignments.find(a => a.id === assignmentId);
    if (asgn) {
      asgn.status = newStatus;
      if (newStatus === 'accepted') asgn.accepted_at = new Date().toISOString();
      if (newStatus === 'picked_up') asgn.picked_up_at = new Date().toISOString();
      if (newStatus === 'delivered') asgn.delivered_at = new Date().toISOString();
      return asgn;
    }
    return null;
  }
}

const localDb = new LocalDatabase();

module.exports = {
  isSupabaseConfigured,
  supabaseClient,
  db: localDb
};
