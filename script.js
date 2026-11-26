/**
 * ============================================================================
 * ZEWA (Zero Waste) - Surplus Food Marketplace
 * Client-Side Hyperlocal Food Redistribution Network
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STORAGE KEYS & INITIAL DEMO DATA CONSTANTS
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    USER: 'zewa_current_user',
    USERS: 'zewa_users',
    LISTINGS: 'zewa_listings',
    ORDERS: 'zewa_orders',
    IMPACT: 'zewa_impact',
    LOCATION: 'zewa_user_location'
  };

  // Demo Food Sellers (Restaurants, Street Food Carts, Bakeries, Hotels, Small Food Shops)
  const DEFAULT_SELLERS = [
    {
      id: 'seller-1',
      name: 'Sri Krishna Tiffin Cart',
      sellerType: 'Street Food Cart',
      owner: 'Ramesh Kumar',
      phone: '+91 98451 23456',
      email: 'seller@zewa.in',
      address: 'Near Indiranagar Metro Station, CMH Road, Bengaluru',
      cuisines: 'South Indian Tiffin, Idli, Dosa, Samosa',
      rating: 4.8,
      distance: 0.6,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 260, y: 290 }
    },
    {
      id: 'seller-2',
      name: 'The Green Bistro & Restaurant',
      sellerType: 'Restaurant',
      owner: 'Chef Priya Patel',
      phone: '+91 98123 45678',
      email: 'greenbistro@zewa.in',
      address: '12th Main, 100ft Road, Indiranagar, Bengaluru',
      cuisines: 'Continental, Healthy Bowls, Indian Curries',
      rating: 4.8,
      distance: 1.1,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 380, y: 220 }
    },
    {
      id: 'seller-3',
      name: 'Sunrise Bakery & Sweets',
      sellerType: 'Bakery & Sweets',
      owner: 'Marco D’Souza',
      phone: '+91 98234 56789',
      email: 'sunrise@zewa.in',
      address: '100ft Road, Defence Colony Junction, Bengaluru',
      cuisines: 'Bakery, Fresh Puffs, Breads, Sweets',
      rating: 4.9,
      distance: 0.9,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 520, y: 310 }
    },
    {
      id: 'seller-4',
      name: 'Sagar Deluxe Hotel',
      sellerType: 'Hotel & Restaurant',
      owner: 'Manjunath Hegde',
      phone: '+91 98345 67890',
      email: 'sagardeluxe@zewa.in',
      address: 'HAL 2nd Stage, Indiranagar, Bengaluru',
      cuisines: 'North & South Indian, Biryani, Roti Meals',
      rating: 4.7,
      distance: 1.5,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 620, y: 190 }
    },
    {
      id: 'seller-5',
      name: 'Annapoorna Bhojanalaya',
      sellerType: 'Small Food Shop',
      owner: 'Ramanathan Iyer',
      phone: '+91 98678 90123',
      email: 'annapoorna@zewa.in',
      address: 'Double Road, Indiranagar, Bengaluru',
      cuisines: 'Traditional Meals, Chapati, Rice & Dal',
      rating: 4.6,
      distance: 1.8,
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 180, y: 460 }
    }
  ];
  const DEFAULT_RESTAURANTS = DEFAULT_SELLERS;

  // 3 Distinct User Roles with 1-Click Access: Customer, Food Seller, Organization
  const DEFAULT_USERS = [
    {
      id: 'user-cust-1',
      name: 'Aarav Sharma',
      email: 'customer@zewa.in',
      password: 'pass123',
      role: 'customer',
      customerType: 'College Student (RVCE)',
      phone: '+91 98765 43210',
      city: 'Indiranagar, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      savedKg: 8.4,
      savedMoney: 2150
    },
    {
      id: 'user-seller-1',
      name: 'Ramesh Kumar',
      sellerName: 'Sri Krishna Tiffin Cart',
      restaurantName: 'Sri Krishna Tiffin Cart',
      sellerId: 'seller-1',
      restaurantId: 'seller-1',
      sellerType: 'Street Food Cart',
      email: 'seller@zewa.in',
      password: 'pass123',
      role: 'seller',
      phone: '+91 98451 23456',
      city: 'Indiranagar, Bengaluru',
      address: 'Near Indiranagar Metro Station, CMH Road, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'user-seller-2',
      name: 'Chef Priya Patel',
      sellerName: 'The Green Bistro & Restaurant',
      restaurantName: 'The Green Bistro & Restaurant',
      sellerId: 'seller-2',
      restaurantId: 'seller-2',
      sellerType: 'Restaurant',
      email: 'greenbistro@zewa.in',
      password: 'pass123',
      role: 'seller',
      phone: '+91 98123 45678',
      city: 'Indiranagar, Bengaluru',
      address: '12th Main, 100ft Road, Indiranagar, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'user-org-1',
      name: 'Sister Mary',
      orgName: 'Shanti Ashram & Children Orphanage',
      orgId: 'org-1',
      orgType: 'Orphanage & Ashram',
      email: 'ngo@zewa.in',
      password: 'pass123',
      role: 'organization',
      phone: '+91 98440 12345',
      city: 'Koramangala, Bengaluru',
      address: '4th Block, Koramangala, Bengaluru',
      beneficiariesCount: 45,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
      totalMealsReceived: 64,
      totalKgReceived: 38.4
    }
  ];

  // 10 Diverse Indian Surplus Food Listings: SELL (50% Off) & DONATE (Free)
  const DEFAULT_LISTINGS = [
    {
      id: 'food-1',
      title: 'Masala Dosa & Podi Idli Combo Box',
      sellerId: 'seller-1',
      restaurantId: 'seller-1',
      sellerName: 'Sri Krishna Tiffin Cart',
      restaurantName: 'Sri Krishna Tiffin Cart',
      sellerType: 'Street Food Cart',
      sellerPhone: '+91 98451 23456',
      location: 'CMH Road, Indiranagar',
      category: 'Tiffin',
      diet: 'veg',
      listingType: 'sell',
      originalPrice: 90,
      discountedPrice: 45,
      discountPercent: 50,
      quantity: 6,
      pickupStart: '19:30',
      pickupEnd: '21:30',
      lastCollectionTime: '22:00',
      distance: 0.6,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      description: '2 crispy butter masala dosas and 4 soft podi idlis packed hot with fresh coconut chutney and spiced piping sambar.',
      ingredients: 'Rice, urad dal, ghee, potato masala, mustard seeds, curry leaves, gunpowder podi.',
      expiryNote: 'Fresh evening dinner batch. Consume warm.'
    },
    {
      id: 'food-2',
      title: 'South Indian Executive Thali / Meals',
      sellerId: 'seller-5',
      restaurantId: 'seller-5',
      sellerName: 'Annapoorna Bhojanalaya',
      restaurantName: 'Annapoorna Bhojanalaya',
      sellerType: 'Small Food Shop',
      sellerPhone: '+91 98678 90123',
      location: 'Double Road, Indiranagar',
      category: 'Meals',
      diet: 'veg',
      listingType: 'sell',
      originalPrice: 140,
      discountedPrice: 69,
      discountPercent: 51,
      quantity: 5,
      pickupStart: '20:00',
      pickupEnd: '22:00',
      lastCollectionTime: '22:30',
      distance: 1.8,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
      description: 'Complete wholesome meal: Steamed boiled rice, drumstick sambar, tomato rasam, vegetable palya, kootu, curd, and papad.',
      ingredients: 'Lentils, seasonal country vegetables, coconut, tamarind, rice, fresh curd.',
      expiryNote: 'Packed cleanly in eco-friendly meal containers.'
    },
    {
      id: 'food-3',
      title: 'Fresh Chapati & Mixed Vegetable Kurma (10 Portions)',
      sellerId: 'seller-4',
      restaurantId: 'seller-4',
      sellerName: 'Sagar Deluxe Hotel',
      restaurantName: 'Sagar Deluxe Hotel',
      sellerType: 'Hotel & Restaurant',
      sellerPhone: '+91 98345 67890',
      location: 'HAL 2nd Stage, Indiranagar',
      category: 'Meals',
      diet: 'veg',
      listingType: 'donate',
      originalPrice: 150,
      discountedPrice: 0,
      discountPercent: 100,
      quantity: 10,
      pickupStart: '20:30',
      pickupEnd: '22:00',
      lastCollectionTime: '22:30',
      distance: 1.5,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
      description: 'FREE DONATION: Soft wholewheat tawa chapatis (3 per pack) with mildly spiced coconut and vegetable kurma. Ideal for orphanages, hostels, or individuals in need.',
      ingredients: '100% whole wheat flour, potatoes, green peas, carrots, coconut gravy.',
      expiryNote: 'Safe food prepared today. Stored hot in hotel kitchen.'
    },
    {
      id: 'food-4',
      title: 'Steamed Basmati Rice & Dal Tadka (Surplus Pack)',
      sellerId: 'seller-2',
      restaurantId: 'seller-2',
      sellerName: 'The Green Bistro & Restaurant',
      restaurantName: 'The Green Bistro & Restaurant',
      sellerType: 'Restaurant',
      sellerPhone: '+91 98123 45678',
      location: '100ft Road, Indiranagar',
      category: 'Meals',
      diet: 'veg',
      listingType: 'donate',
      originalPrice: 180,
      discountedPrice: 0,
      discountPercent: 100,
      quantity: 8,
      pickupStart: '21:00',
      pickupEnd: '22:30',
      lastCollectionTime: '23:00',
      distance: 1.1,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      description: 'FREE DONATION: Fragrant steamed basmati rice with slow-cooked yellow arhar dal tempered in ghee, cumin, garlic, and fresh coriander.',
      ingredients: 'Basmati rice, toor dal, cumin seeds, garlic, ghee, turmeric, coriander.',
      expiryNote: 'Stored hot in insulated warmers. Collect before 23:00.'
    },
    {
      id: 'food-5',
      title: 'Bakery Veg Puffs & Sweet Breads Box',
      sellerId: 'seller-3',
      restaurantId: 'seller-3',
      sellerName: 'Sunrise Bakery & Sweets',
      restaurantName: 'Sunrise Bakery & Sweets',
      sellerType: 'Bakery & Sweets',
      sellerPhone: '+91 98234 56789',
      location: '100ft Road, Indiranagar',
      category: 'Bakery',
      diet: 'veg',
      listingType: 'sell',
      originalPrice: 120,
      discountedPrice: 59,
      discountPercent: 51,
      quantity: 4,
      pickupStart: '19:00',
      pickupEnd: '21:00',
      lastCollectionTime: '21:30',
      distance: 0.9,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      description: 'Box containing 2 flaky spiced vegetable puffs, 1 sweet milk bun loaf, and 2 cream rolls baked fresh this morning.',
      ingredients: 'Wheat flour, potatoes, peas, spices, butter puff pastry, milk, yeast.',
      expiryNote: 'Safe to consume for 36 hours. Best enjoyed warm with tea.'
    },
    {
      id: 'food-6',
      title: 'Hyderabadi Dum Biryani with Salan & Raitha',
      sellerId: 'seller-4',
      restaurantId: 'seller-4',
      sellerName: 'Sagar Deluxe Hotel',
      restaurantName: 'Sagar Deluxe Hotel',
      sellerType: 'Hotel & Restaurant',
      sellerPhone: '+91 98345 67890',
      location: 'HAL 2nd Stage, Indiranagar',
      category: 'Meals',
      diet: 'non-veg',
      listingType: 'sell',
      originalPrice: 260,
      discountedPrice: 129,
      discountPercent: 50,
      quantity: 4,
      pickupStart: '21:00',
      pickupEnd: '22:45',
      lastCollectionTime: '23:00',
      distance: 1.5,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      description: 'Slow-cooked dum basmati rice layered with aromatic spices and tender marinated meat. Accompanied by mirchi ka salan and onion cucumber raitha.',
      ingredients: 'Aged basmati rice, chicken, curd, brown onions, saffron, mint, whole spices.',
      expiryNote: 'Hot dinner handi surplus. Reheat upon pickup.'
    },
    {
      id: 'food-7',
      title: 'Hot Samosa & Onion Pakoda Evening Box',
      sellerId: 'seller-1',
      restaurantId: 'seller-1',
      sellerName: 'Sri Krishna Tiffin Cart',
      restaurantName: 'Sri Krishna Tiffin Cart',
      sellerType: 'Street Food Cart',
      sellerPhone: '+91 98451 23456',
      location: 'CMH Road, Indiranagar',
      category: 'Snacks',
      diet: 'veg',
      listingType: 'donate',
      originalPrice: 100,
      discountedPrice: 0,
      discountPercent: 100,
      quantity: 6,
      pickupStart: '19:00',
      pickupEnd: '20:30',
      lastCollectionTime: '21:00',
      distance: 0.6,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      description: 'FREE DONATION: 4 golden potato peas samosas and crisp onion pakodas with tangy mint-coriander chutney. Perfect for immediate community distribution.',
      ingredients: 'Maida, potatoes, green peas, onions, gram flour (besan), green chillies, spices.',
      expiryNote: 'Fried in fresh groundnut oil today. Consume immediately.'
    },
    {
      id: 'food-8',
      title: 'Fresh Cut Fruit Bowls & Papaya Slices',
      sellerId: 'seller-2',
      restaurantId: 'seller-2',
      sellerName: 'The Green Bistro & Restaurant',
      restaurantName: 'The Green Bistro & Restaurant',
      sellerType: 'Restaurant',
      sellerPhone: '+91 98123 45678',
      location: '100ft Road, Indiranagar',
      category: 'Fresh Produce',
      diet: 'veg',
      listingType: 'donate',
      originalPrice: 120,
      discountedPrice: 0,
      discountPercent: 100,
      quantity: 5,
      pickupStart: '20:00',
      pickupEnd: '21:30',
      lastCollectionTime: '22:00',
      distance: 1.1,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      description: 'FREE DONATION: Chilled bowls of ripe sweet papaya, pineapple slices, watermelons, and pomegranate seeds packed in food-grade hygienic containers.',
      ingredients: '100% fresh washed fruits, cut fresh during afternoon prep.',
      expiryNote: 'Keep chilled. Consume within 24 hours.'
    },
    {
      id: 'food-9',
      title: 'Gulab Jamun & Gajar Halwa Sweet Box',
      sellerId: 'seller-3',
      restaurantId: 'seller-3',
      sellerName: 'Sunrise Bakery & Sweets',
      restaurantName: 'Sunrise Bakery & Sweets',
      sellerType: 'Bakery & Sweets',
      sellerPhone: '+91 98234 56789',
      location: '100ft Road, Indiranagar',
      category: 'Desserts',
      diet: 'veg',
      listingType: 'sell',
      originalPrice: 150,
      discountedPrice: 75,
      discountPercent: 50,
      quantity: 5,
      pickupStart: '19:30',
      pickupEnd: '21:30',
      lastCollectionTime: '22:00',
      distance: 0.9,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      description: 'Box containing 4 melt-in-the-mouth khoya gulab jamuns soaked in cardamom syrup and 100g pure ghee Delhi carrot halwa.',
      ingredients: 'Mawa/khoya, dairy milk, sugar, green cardamom, red carrots, ghee, almonds.',
      expiryNote: 'Fresh sweet counter batch. Shelf life: 3 days.'
    },
    {
      id: 'food-10',
      title: 'Soft Idli & Medu Vada Morning Tiffin Batch',
      sellerId: 'seller-5',
      restaurantId: 'seller-5',
      sellerName: 'Annapoorna Bhojanalaya',
      restaurantName: 'Annapoorna Bhojanalaya',
      sellerType: 'Small Food Shop',
      sellerPhone: '+91 98678 90123',
      location: 'Double Road, Indiranagar',
      category: 'Tiffin',
      diet: 'veg',
      listingType: 'sell',
      originalPrice: 80,
      discountedPrice: 39,
      discountPercent: 51,
      quantity: 6,
      pickupStart: '19:00',
      pickupEnd: '21:00',
      lastCollectionTime: '21:30',
      distance: 1.8,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      description: '4 steamed soft rice idlis and 2 crispy medu vadas served with coconut chutney and tomato onion kara chutney.',
      ingredients: 'Parboiled idli rice, urad dal, black peppercorns, curry leaves, ginger.',
      expiryNote: 'Fresh tiffin portion. Consume warm.'
    }
  ];

  // Sample Orders demonstrating Customer Purchases and Organization Donations
  const DEFAULT_ORDERS = [
    {
      id: 'ZW-2026-9041',
      pickupCode: 'ZEWA-8492',
      foodId: 'food-1',
      foodTitle: 'Masala Dosa & Podi Idli Combo Box',
      foodImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
      sellerId: 'seller-1',
      sellerName: 'Sri Krishna Tiffin Cart',
      sellerAddress: 'Near Indiranagar Metro Station, CMH Road, Bengaluru',
      sellerPhone: '+91 98451 23456',
      reserverName: 'Aarav Sharma',
      reserverEmail: 'customer@zewa.in',
      reserverPhone: '+91 98765 43210',
      reserverRole: 'customer',
      customerName: 'Aarav Sharma',
      customerEmail: 'customer@zewa.in',
      customerPhone: '+91 98765 43210',
      listingType: 'sell',
      quantity: 1,
      unitPrice: 45,
      totalPrice: 45,
      moneySaved: 45,
      wasteSavedKg: 0.6,
      paymentMethod: 'Pay Directly at Pickup (Cash / UPI)',
      pickupStart: '19:30',
      pickupEnd: '21:30',
      lastCollectionTime: '22:00',
      createdAt: '2026-11-26T14:15:00.000Z',
      status: 'ready_for_pickup' // ready_for_pickup | collected | cancelled
    },
    {
      id: 'ZW-2026-8832',
      pickupCode: 'ZEWA-3174',
      foodId: 'food-3',
      foodTitle: 'Fresh Chapati & Mixed Vegetable Kurma',
      foodImage: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80',
      sellerId: 'seller-4',
      sellerName: 'Sagar Deluxe Hotel',
      sellerAddress: 'HAL 2nd Stage, Indiranagar, Bengaluru',
      sellerPhone: '+91 98345 67890',
      reserverName: 'Shanti Ashram & Children Orphanage',
      reserverEmail: 'ngo@zewa.in',
      reserverPhone: '+91 98440 12345',
      reserverRole: 'organization',
      customerName: 'Sister Mary (Shanti Ashram)',
      customerEmail: 'ngo@zewa.in',
      customerPhone: '+91 98440 12345',
      listingType: 'donate',
      quantity: 5,
      unitPrice: 0,
      totalPrice: 0,
      moneySaved: 750,
      wasteSavedKg: 3.0,
      paymentMethod: '100% Free Donated Food',
      pickupStart: '20:30',
      pickupEnd: '22:00',
      lastCollectionTime: '22:30',
      createdAt: '2026-11-26T15:00:00.000Z',
      status: 'ready_for_pickup'
    },
    {
      id: 'ZW-2026-7215',
      pickupCode: 'ZEWA-5510',
      foodId: 'food-2',
      foodTitle: 'South Indian Executive Thali / Meals',
      foodImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80',
      sellerId: 'seller-5',
      sellerName: 'Annapoorna Bhojanalaya',
      sellerAddress: 'Double Road, Indiranagar, Bengaluru',
      sellerPhone: '+91 98678 90123',
      reserverName: 'Aarav Sharma',
      reserverEmail: 'customer@zewa.in',
      reserverPhone: '+91 98765 43210',
      reserverRole: 'customer',
      customerName: 'Aarav Sharma',
      customerEmail: 'customer@zewa.in',
      customerPhone: '+91 98765 43210',
      listingType: 'sell',
      quantity: 2,
      unitPrice: 69,
      totalPrice: 138,
      moneySaved: 142,
      wasteSavedKg: 1.2,
      paymentMethod: 'Pay Directly at Pickup (Cash / UPI)',
      pickupStart: '20:00',
      pickupEnd: '22:00',
      lastCollectionTime: '22:30',
      createdAt: '2026-11-25T19:30:00.000Z',
      status: 'collected'
    }
  ];

  // Global Impact Base Counters
  const DEFAULT_IMPACT = {
    mealsRescued: 3482,
    kgWastePrevented: 2089.2,
    co2MitigatedKg: 5222.0,
    moneySavedRupees: 522300
  };

  // --------------------------------------------------------------------------
  // 2. STATE STORE & INITIALIZATION
  // --------------------------------------------------------------------------
  const Store = {
    getUser() {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    },
    setUser(user) {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    },
    getUsers() {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    },
    saveUsers(users) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },
    getListings() {
      const data = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return data ? JSON.parse(data) : DEFAULT_LISTINGS;
    },
    saveListings(listings) {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    },
    getOrders() {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : DEFAULT_ORDERS;
    },
    saveOrders(orders) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    },
    getImpact() {
      const data = localStorage.getItem(STORAGE_KEYS.IMPACT);
      return data ? JSON.parse(data) : DEFAULT_IMPACT;
    },
    saveImpact(impact) {
      localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(impact));
    },
    init(forceReset = false) {
      const stored = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      const needsFreshData = forceReset || !stored || !stored.includes('listingType');
      if (needsFreshData) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(DEFAULT_LISTINGS));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
        localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(DEFAULT_IMPACT));
        if (forceReset) {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    }
  };

  // Initialize data on load
  Store.init();

  // --------------------------------------------------------------------------
  // 3. APPLICATION STATE & FILTER VARIABLES
  // --------------------------------------------------------------------------
  const AppState = {
    currentView: 'home',
    currentUser: Store.getUser(),
    activeFilter: {
      search: '',
      location: '',
      type: 'all', // 'all' | 'sell' | 'donate'
      category: 'all',
      diet: 'all',
      maxPrice: 600,
      maxDistance: 15,
      sortBy: 'discount-desc'
    },
    selectedFoodForModal: null,
    selectedFoodForCheckout: null,
    checkoutQuantity: 1
  };

  // --------------------------------------------------------------------------
  // 4. UI HELPER FUNCTIONS: TOASTS, MODALS & FORMATTERS
  // --------------------------------------------------------------------------
  function showToast(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = 'ℹ️';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function confirmAction(title, text, onConfirm) {
    const modal = document.getElementById('modal-confirm-dialog');
    const titleEl = document.getElementById('prompt-dialog-title');
    const textEl = document.getElementById('prompt-dialog-text');
    const confirmBtn = document.getElementById('btn-prompt-confirm');
    const cancelBtn = document.getElementById('btn-prompt-cancel');

    titleEl.textContent = title;
    textEl.textContent = text;
    openModal('modal-confirm-dialog');

    // Remove old listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
      closeModal('modal-confirm-dialog');
      if (typeof onConfirm === 'function') onConfirm();
    });

    cancelBtn.onclick = () => closeModal('modal-confirm-dialog');
  }

  function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  function generatePickupCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'ZEWA-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function generateBookingId() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `#ZW-2026-${random}`;
  }

  // --------------------------------------------------------------------------
  // 5. VIEW ROUTER (SPA ENGINE)
  // --------------------------------------------------------------------------
  function navigateTo(viewName) {
    // Map aliases
    if (viewName === 'seller-dashboard') {
      viewName = 'restaurant-dashboard';
    }

    // Role-based protection & routing
    if (viewName === 'customer-dashboard') {
      if (!AppState.currentUser) {
        showToast('Please log in as a customer first', 'info');
        openModal('modal-auth');
        return;
      }
      if (AppState.currentUser.role !== 'customer') {
        viewName = AppState.currentUser.role === 'organization' ? 'organization-dashboard' : 'restaurant-dashboard';
      }
    } else if (viewName === 'restaurant-dashboard') {
      if (!AppState.currentUser) {
        showToast('Please log in as a food seller first', 'info');
        openModal('modal-auth');
        return;
      }
      if (AppState.currentUser.role !== 'restaurant' && AppState.currentUser.role !== 'seller') {
        viewName = AppState.currentUser.role === 'organization' ? 'organization-dashboard' : 'customer-dashboard';
      }
    } else if (viewName === 'organization-dashboard') {
      if (!AppState.currentUser) {
        showToast('Please log in as an organization first', 'info');
        openModal('modal-auth');
        return;
      }
      if (AppState.currentUser.role !== 'organization') {
        viewName = (AppState.currentUser.role === 'restaurant' || AppState.currentUser.role === 'seller') 
          ? 'restaurant-dashboard' 
          : 'customer-dashboard';
      }
    }

    AppState.currentView = viewName;

    // Toggle active view section
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update active state in nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile nav drawer & backdrop if open
    document.getElementById('main-navigation')?.classList.remove('mobile-open');
    document.getElementById('mobile-menu-toggle')?.classList.remove('active');
    document.getElementById('mobile-nav-backdrop')?.classList.remove('active');

    // Smooth scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh context-specific components
    if (viewName === 'home') {
      renderFeaturedFood();
      renderGlobalImpactStats();
    } else if (viewName === 'marketplace') {
      renderMarketplace();
    } else if (viewName === 'map-discovery') {
      renderMapPins();
    } else if (viewName === 'impact') {
      renderImpactPage();
    } else if (viewName === 'customer-dashboard') {
      renderCustomerDashboard();
    } else if (viewName === 'restaurant-dashboard') {
      renderRestaurantDashboard();
    } else if (viewName === 'organization-dashboard') {
      renderOrganizationDashboard();
    }
  }

  // Hash change listener
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
  });

  // --------------------------------------------------------------------------
  // 6. AUTHENTICATION & SESSION MANAGEMENT
  // --------------------------------------------------------------------------
  function updateAuthUI() {
    const user = AppState.currentUser;
    const guestActions = document.getElementById('auth-guest-actions');
    const userActions = document.getElementById('auth-user-actions');
    const userRoleBadge = document.getElementById('user-role-badge');
    const navUserAvatar = document.getElementById('nav-user-avatar');
    const navUserName = document.getElementById('nav-user-name');
    const dropdownUserName = document.getElementById('dropdown-user-name');
    const dropdownUserEmail = document.getElementById('dropdown-user-email');
    const dropdownUserRole = document.getElementById('dropdown-user-role');
    const customerLinks = document.getElementById('dropdown-customer-links');
    const sellerLinks = document.getElementById('dropdown-seller-links') || document.getElementById('dropdown-restaurant-links');
    const orgLinks = document.getElementById('dropdown-org-links');
    const activeOrdersCountEl = document.getElementById('active-orders-count');

    if (user) {
      guestActions.classList.add('hidden');
      userActions.classList.remove('hidden');

      const isSeller = user.role === 'restaurant' || user.role === 'seller';
      const isOrg = user.role === 'organization';

      if (isOrg) {
        userRoleBadge.textContent = '🏛️ Organization';
        navUserName.textContent = user.orgName || user.name;
        dropdownUserName.textContent = user.orgName || user.name;
        dropdownUserRole.textContent = 'Verified Organization';
        customerLinks?.classList.add('hidden');
        sellerLinks?.classList.add('hidden');
        orgLinks?.classList.remove('hidden');
      } else if (isSeller) {
        userRoleBadge.textContent = '🏪 Food Seller';
        navUserName.textContent = user.restaurantName || user.name;
        dropdownUserName.textContent = user.restaurantName || user.name;
        dropdownUserRole.textContent = 'Food Seller Account';
        customerLinks?.classList.add('hidden');
        sellerLinks?.classList.remove('hidden');
        orgLinks?.classList.add('hidden');
      } else {
        userRoleBadge.textContent = '👤 Customer';
        navUserName.textContent = user.name;
        dropdownUserName.textContent = user.name;
        dropdownUserRole.textContent = 'Customer Account';
        customerLinks?.classList.remove('hidden');
        sellerLinks?.classList.add('hidden');
        orgLinks?.classList.add('hidden');
      }

      navUserAvatar.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
      dropdownUserEmail.textContent = user.email;

      // Update active order pill count
      const allOrders = Store.getOrders();
      let myActiveCount = 0;
      if (isOrg) {
        myActiveCount = allOrders.filter(o => 
          (o.reserverRole === 'organization' || o.customerEmail === user.email || o.reserverEmail === user.email) &&
          o.status === 'ready_for_pickup'
        ).length;
      } else if (isSeller) {
        myActiveCount = allOrders.filter(o => 
          (o.sellerId === user.restaurantId || o.restaurantId === user.restaurantId || o.sellerName === user.restaurantName) &&
          o.status === 'ready_for_pickup'
        ).length;
      } else {
        myActiveCount = allOrders.filter(o => 
          o.customerEmail === user.email && o.status === 'ready_for_pickup'
        ).length;
      }

      if (activeOrdersCountEl) {
        activeOrdersCountEl.textContent = myActiveCount;
      }
    } else {
      guestActions.classList.remove('hidden');
      userActions.classList.add('hidden');
      if (activeOrdersCountEl) activeOrdersCountEl.textContent = '0';
    }
  }

  function handleLogin(email, password, remember = true) {
    const users = Store.getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      showToast('No account found with this email. Please register.', 'error');
      return false;
    }

    if (foundUser.password !== password) {
      showToast('Incorrect password. Default test password is pass123', 'error');
      return false;
    }

    AppState.currentUser = foundUser;
    if (remember) {
      Store.setUser(foundUser);
    }
    updateAuthUI();
    closeModal('modal-auth');

    showToast(`Welcome back, ${foundUser.name}!`, 'success');

    // Route to appropriate dashboard
    if (foundUser.role === 'organization') {
      window.location.hash = 'organization-dashboard';
    } else if (foundUser.role === 'restaurant' || foundUser.role === 'seller') {
      window.location.hash = 'restaurant-dashboard';
    } else {
      window.location.hash = 'customer-dashboard';
    }
    return true;
  }

  function handleRegister(data) {
    const users = Store.getUsers();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      showToast('An account with this email already exists.', 'error');
      return false;
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role === 'restaurant' ? 'seller' : data.role,
      phone: data.phone,
      city: 'Indiranagar, Bengaluru',
      avatar: (data.role === 'seller' || data.role === 'restaurant')
        ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80'
        : data.role === 'organization'
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      savedKg: 0,
      savedMoney: 0
    };

    if (data.role === 'seller' || data.role === 'restaurant') {
      newUser.role = 'seller';
      newUser.restaurantName = data.name;
      newUser.sellerName = data.name;
      newUser.restaurantId = 'seller-' + Date.now();
      newUser.address = data.address || 'Bengaluru';
    } else if (data.role === 'organization') {
      newUser.orgName = data.name;
      newUser.orgType = data.orgType || 'Student Hostel';
      newUser.address = data.address || 'Bengaluru';
    }

    users.push(newUser);
    Store.saveUsers(users);

    AppState.currentUser = newUser;
    Store.setUser(newUser);
    updateAuthUI();
    closeModal('modal-auth');

    showToast(`Account created successfully! Welcome to ZEWA, ${newUser.name}.`, 'success');
    if (newUser.role === 'organization') {
      window.location.hash = 'organization-dashboard';
    } else if (newUser.role === 'seller' || newUser.role === 'restaurant') {
      window.location.hash = 'restaurant-dashboard';
    } else {
      window.location.hash = 'customer-dashboard';
    }
    return true;
  }

  function handleLogout() {
    confirmAction('Sign Out of ZEWA', 'Are you sure you want to log out?', () => {
      AppState.currentUser = null;
      Store.setUser(null);
      updateAuthUI();
      showToast('You have been safely signed out.', 'info');
      window.location.hash = 'home';
    });
  }

  // --------------------------------------------------------------------------
  // 7. FOOD MARKETPLACE RENDERING & MULTI-FACET FILTERING
  // --------------------------------------------------------------------------
  function createFoodCardHTML(item) {
    const isSoldOut = item.quantity <= 0 || item.status === 'sold-out';
    const dietIcon = item.diet === 'veg' ? '🟢 Pure Veg' : '🔴 Non-Veg';
    const isDonate = item.listingType === 'donate';
    const sellerName = item.sellerName || item.restaurantName;
    const sellerType = item.sellerType ? ` • ${item.sellerType}` : '';

    return `
      <div class="food-card ${isSoldOut ? 'sold-out' : ''}" data-food-id="${item.id}">
        <div class="food-card-thumb-wrap">
          <img src="${item.image}" alt="${item.title}" class="food-card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
          ${isDonate 
            ? `<span class="food-badge-donate">🎁 100% FREE</span>`
            : `<span class="food-badge-discount">${item.discountPercent}% OFF</span>`
          }
          <span class="food-badge-diet ${item.diet}">${dietIcon}</span>
          <div class="food-card-pickup-time">
            <span>🕒 Pickup: <strong>${item.pickupStart} – ${item.pickupEnd}</strong></span>
          </div>
        </div>

        <div class="food-card-body">
          <div class="food-card-meta">
            <span class="food-restaurant-name" title="${sellerName}">${sellerName}${sellerType}</span>
            <span class="food-distance">📍 ${item.distance} km</span>
          </div>

          <h3 class="food-card-title" title="${item.title}">${item.title}</h3>
          <span class="food-card-category-tag">${item.category}</span>

          <div class="food-card-stock">
            ${isSoldOut 
              ? '❌ Sold Out For Today' 
              : `📦 <strong>${item.quantity} ${item.quantity === 1 ? 'portion' : 'portions'} available</strong>`}
          </div>

          <div class="food-card-pricing">
            ${isDonate 
              ? `
                <span class="price-orig">${formatCurrency(item.originalPrice)}</span>
                <span class="price-free">FREE DONATION</span>
                <span class="price-saved" style="color: #2D6A4F; font-weight: 700;">Community Gift</span>
              ` 
              : `
                <span class="price-orig">${formatCurrency(item.originalPrice)}</span>
                <span class="price-disc">${formatCurrency(item.discountedPrice)}</span>
                <span class="price-saved">Save ${formatCurrency(item.originalPrice - item.discountedPrice)}</span>
              `
            }
          </div>

          <div class="food-card-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-view-details" data-id="${item.id}">
              Details
            </button>
            <button type="button" class="btn btn-primary btn-sm btn-reserve-card ${isSoldOut ? 'disabled' : ''}" data-id="${item.id}">
              ${isSoldOut ? 'Sold Out' : (isDonate ? 'Claim Free' : 'Reserve')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFeaturedFood(type = 'all') {
    const grid = document.getElementById('featured-food-grid');
    if (!grid) return;

    AppState.featuredType = type;
    const listings = Store.getListings();

    let filtered = listings.filter(i => i.status === 'available' && i.quantity > 0);
    if (type === 'sell') {
      filtered = filtered.filter(i => i.listingType === 'sell');
    } else if (type === 'donate') {
      filtered = filtered.filter(i => i.listingType === 'donate');
    }

    const topPicks = filtered.slice(0, 4);

    if (topPicks.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1; padding: 2rem;">
          <p>No listings available for this tab currently. Check back at evening pickup hours!</p>
        </div>
      `;
    } else {
      grid.innerHTML = topPicks.map(createFoodCardHTML).join('');
      attachFoodCardListeners(grid);
    }
  }

  function getFilteredListings() {
    const listings = Store.getListings();
    const filter = AppState.activeFilter;

    return listings.filter(item => {
      // Listing type: all | sell | donate
      if (filter.type && filter.type !== 'all' && item.listingType !== filter.type) {
        return false;
      }

      // Locality / Area search
      if (filter.location && filter.location.trim()) {
        const locQuery = filter.location.toLowerCase();
        const itemLoc = (item.location || item.restaurantAddress || '').toLowerCase();
        const sellerName = (item.sellerName || item.restaurantName || '').toLowerCase();
        if (!itemLoc.includes(locQuery) && !sellerName.includes(locQuery)) {
          return false;
        }
      }

      // Search text (title, restaurant, description, category)
      if (filter.search && filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesRest = (item.sellerName || item.restaurantName).toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesRest && !matchesDesc && !matchesCat) return false;
      }

      // Category
      if (filter.category !== 'all' && item.category !== filter.category) {
        return false;
      }

      // Dietary
      if (filter.diet !== 'all' && item.diet !== filter.diet) {
        return false;
      }

      // Max price (only applies to sell items)
      if (item.listingType === 'sell' && item.discountedPrice > filter.maxPrice) {
        return false;
      }

      // Distance
      if (item.distance > filter.maxDistance) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'discount-desc') {
        return b.discountPercent - a.discountPercent;
      }
      if (filter.sortBy === 'price-asc') {
        return a.discountedPrice - b.discountedPrice;
      }
      if (filter.sortBy === 'distance-asc') {
        return a.distance - b.distance;
      }
      if (filter.sortBy === 'time-asc') {
        return a.pickupStart.localeCompare(b.pickupStart);
      }
      return 0;
    });
  }

  function renderMarketplace() {
    const grid = document.getElementById('marketplace-food-grid');
    const emptyState = document.getElementById('marketplace-empty-state');
    const resultsCount = document.getElementById('results-count-text');
    if (!grid) return;

    const filtered = getFilteredListings();

    if (resultsCount) {
      resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> surplus ${filtered.length === 1 ? 'item' : 'items'} available for pickup`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      grid.innerHTML = filtered.map(createFoodCardHTML).join('');
      attachFoodCardListeners(grid);
    }
  }

  function attachFoodCardListeners(container) {
    container.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openFoodDetailsModal(id);
      });
    });

    container.querySelectorAll('.food-card-thumb-wrap, .food-card-title').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const card = el.closest('.food-card');
        const id = card?.getAttribute('data-id');
        if (id) openFoodDetailsModal(id);
      });
    });

    container.querySelectorAll('.btn-reserve-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        initiateReservation(id);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. FOOD DETAILS MODAL & LIVE QUANTITY CALCULATOR
  // --------------------------------------------------------------------------
  function openFoodDetailsModal(foodId) {
    const listings = Store.getListings();
    const item = listings.find(i => i.id === foodId);
    if (!item) return;

    AppState.selectedFoodForModal = item;
    AppState.checkoutQuantity = 1;

    const modalContent = document.getElementById('food-modal-content');
    const isSoldOut = item.quantity <= 0 || item.status === 'sold-out';
    const isDonate = item.listingType === 'donate';
    const sellerTitle = item.sellerName || item.restaurantName;
    const sellerPhone = item.sellerPhone || '+91 98451 23456';
    const pickupLoc = item.location || item.restaurantAddress || 'Indiranagar, Bengaluru';

    modalContent.innerHTML = `
      <div class="food-modal-img-wrap">
        <img src="${item.image}" alt="${item.title}" class="food-modal-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
        ${isDonate 
          ? `<span class="food-badge-donate">🎁 100% FREE</span>`
          : `<span class="food-badge-discount">${item.discountPercent}% OFF</span>`
        }
      </div>

      <div class="food-modal-inner">
        <div class="food-modal-rest-badge">
          <div>
            <strong style="color: var(--color-primary-dark); font-size: 1rem;">🏪 ${sellerTitle}</strong>
            <span style="color: var(--color-text-muted);"> • 📍 ${item.distance} km away</span>
          </div>
          <span class="food-badge-diet ${item.diet}">${item.diet === 'veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}</span>
        </div>

        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; line-height: 1.25;">${item.title}</h2>
        <span class="food-card-category-tag">${item.category}</span>

        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 1.25rem; line-height: 1.6;">
          ${item.description}
        </p>

        <div style="background: var(--color-surface-subtle); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem;">
          <div><strong>📍 Pickup Location:</strong> ${pickupLoc}</div>
          <div><strong>📞 Seller Contact:</strong> ${sellerPhone}</div>
          <div><strong>🕒 Pickup Window:</strong> Today, ${item.pickupStart} – ${item.pickupEnd}</div>
          <div><strong>⏳ Last Safe Collection:</strong> Before ${item.lastCollectionTime || item.pickupEnd}</div>
          <div><strong>🛡️ Food Safety:</strong> Prepared fresh today in licensed kitchen, safe & suitable for consumption.</div>
        </div>

        <div class="food-modal-qty-control">
          <div>
            <strong style="display: block; font-size: 0.9rem;">Select Portions to Reserve:</strong>
            <small style="color: var(--color-text-muted);">${item.quantity} available</small>
          </div>
          <div class="qty-counter-large">
            <button type="button" class="qty-btn-large" id="modal-qty-minus" ${AppState.checkoutQuantity <= 1 ? 'disabled' : ''}>-</button>
            <span class="qty-val-large" id="modal-qty-value">1</span>
            <button type="button" class="qty-btn-large" id="modal-qty-plus" ${AppState.checkoutQuantity >= item.quantity ? 'disabled' : ''}>+</button>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem;">
          <div>
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">${isDonate ? 'Donation Cost:' : 'Total Payable at Counter:'}</span>
            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
              <span class="original-price" id="modal-total-orig">${formatCurrency(item.originalPrice)}</span>
              <span class="${isDonate ? 'price-free' : 'discounted-price'}" id="modal-total-disc">${isDonate ? '100% FREE' : formatCurrency(item.discountedPrice)}</span>
            </div>
          </div>
          <span class="badge-tag" id="modal-total-saved">${isDonate ? 'Community Donation' : `You save ${formatCurrency(item.originalPrice - item.discountedPrice)}`}</span>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button type="button" class="btn btn-outline" style="flex: 1;" id="btn-modal-close-action">Back</button>
          <button type="button" class="btn btn-primary" style="flex: 2;" id="btn-modal-reserve-action" ${isSoldOut ? 'disabled' : ''}>
            ${isSoldOut ? 'Sold Out' : (isDonate ? 'Claim Free Portion' : 'Proceed to Reserve')}
          </button>
        </div>
      </div>
    `;

    openModal('modal-food-details');

    // Attach quantity selector listeners
    const minusBtn = document.getElementById('modal-qty-minus');
    const plusBtn = document.getElementById('modal-qty-plus');
    const qtyVal = document.getElementById('modal-qty-value');
    const totalOrig = document.getElementById('modal-total-orig');
    const totalDisc = document.getElementById('modal-total-disc');
    const totalSaved = document.getElementById('modal-total-saved');

    const updatePriceDisplay = () => {
      const q = AppState.checkoutQuantity;
      qtyVal.textContent = q;
      totalOrig.textContent = formatCurrency(item.originalPrice * q);
      if (isDonate) {
        totalDisc.textContent = '100% FREE';
        totalSaved.textContent = 'Community Donation';
      } else {
        totalDisc.textContent = formatCurrency(item.discountedPrice * q);
        totalSaved.textContent = `You save ${formatCurrency((item.originalPrice - item.discountedPrice) * q)}`;
      }
      minusBtn.disabled = q <= 1;
      plusBtn.disabled = q >= item.quantity;
    };

    minusBtn.addEventListener('click', () => {
      if (AppState.checkoutQuantity > 1) {
        AppState.checkoutQuantity--;
        updatePriceDisplay();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (AppState.checkoutQuantity < item.quantity) {
        AppState.checkoutQuantity++;
        updatePriceDisplay();
      }
    });

    document.getElementById('btn-modal-close-action').addEventListener('click', () => {
      closeModal('modal-food-details');
    });

    document.getElementById('btn-modal-reserve-action').addEventListener('click', () => {
      closeModal('modal-food-details');
      openCheckoutModal(item, AppState.checkoutQuantity);
    });
  }

  function initiateReservation(foodId) {
    const listings = Store.getListings();
    const item = listings.find(i => i.id === foodId);
    if (!item) return;

    if (item.quantity <= 0 || item.status === 'sold-out') {
      showToast('Sorry, this food item is sold out for today.', 'error');
      return;
    }

    openCheckoutModal(item, 1);
  }

  // --------------------------------------------------------------------------
  // 9. DIRECT COUNTER RESERVATION & PICKUP CONFIRMATION FLOW
  // --------------------------------------------------------------------------
  function openCheckoutModal(item, quantity = 1) {
    // If not logged in, prompt user to log in or use 1-click customer login
    if (!AppState.currentUser) {
      showToast('Please sign in or use one-click access to reserve food', 'info');
      openModal('modal-auth');
      return;
    }

    AppState.selectedFoodForCheckout = item;
    AppState.checkoutQuantity = quantity;

    const modalBody = document.getElementById('checkout-modal-body');
    const isDonate = item.listingType === 'donate';
    const originalTotal = item.originalPrice * quantity;
    const discountedTotal = isDonate ? 0 : item.discountedPrice * quantity;
    const savings = originalTotal - discountedTotal;
    const sellerTitle = item.sellerName || item.restaurantName;
    const sellerPhone = item.sellerPhone || '+91 98451 23456';
    const pickupLoc = item.location || item.restaurantAddress || 'Indiranagar, Bengaluru';

    modalBody.innerHTML = `
      <div class="checkout-item-summary">
        <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'">
        <div style="flex: 1;">
          <h4 style="font-size: 1.05rem; font-weight: 700;">${item.title}</h4>
          <span style="font-size: 0.85rem; color: var(--color-primary-dark); font-weight: 600;">🏪 ${sellerTitle}</span>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.25rem;">
            Quantity: <strong>${quantity} portion(s)</strong> • Window: <strong>${item.pickupStart} – ${item.pickupEnd}</strong>
          </div>
          <div style="font-size: 0.78rem; color: var(--color-text-muted); margin-top: 0.15rem;">
            📍 ${pickupLoc} • 📞 ${sellerPhone}
          </div>
        </div>
      </div>

      <!-- Direct Counter Payment / Free Claim Notice (No Payment Gateway!) -->
      <div class="direct-pay-notice ${isDonate ? 'notice-donate' : ''}">
        <h4>${isDonate ? '🎁 100% Free Donated Food' : '💵 Pay Directly to Seller at Counter'}</h4>
        <p>
          ${isDonate 
            ? 'This surplus food is donated 100% free of cost for community welfare, hostels, ashrams, and individuals in need. No payment is required.' 
            : `Please pay <strong>${formatCurrency(discountedTotal)}</strong> directly to <strong>${sellerTitle}</strong> at the counter when collecting your food (via UPI QR or Cash).`}
        </p>
        <div class="direct-pay-instructions">
          <span>• No online payment gateway or transaction deductions.</span>
          <span>• Show your pickup code at the counter before <strong>${item.lastCollectionTime || item.pickupEnd}</strong>.</span>
        </div>
      </div>

      <div class="bill-breakdown">
        <div class="bill-row">
          <span>Surplus Meals Value:</span>
          <span>${formatCurrency(originalTotal)}</span>
        </div>
        <div class="bill-row" style="color: var(--color-primary-dark); font-weight: 600;">
          <span>${isDonate ? '100% Free Community Donation:' : 'Zero-Waste Direct Savings:'}</span>
          <span>- ${formatCurrency(savings)}</span>
        </div>
        <div class="bill-row total-row">
          <span>Amount to Pay at Pickup:</span>
          <span style="color: ${isDonate ? '#2D6A4F' : 'var(--color-charcoal)'}; font-size: 1.25rem;">${isDonate ? 'FREE (₹0)' : formatCurrency(discountedTotal)}</span>
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-submit-booking">
        <span>${isDonate ? 'Confirm Free Food Claim & Get Code' : 'Confirm Reservation & Get Pickup Code'}</span>
        <svg class="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    `;

    openModal('modal-checkout');

    // Booking confirmation handler
    document.getElementById('btn-submit-booking').addEventListener('click', handleCompleteBooking);
  }

  function handleCompleteBooking() {
    const item = AppState.selectedFoodForCheckout;
    const qty = AppState.checkoutQuantity;
    const user = AppState.currentUser;

    if (!item || !user) return;

    const submitBtn = document.getElementById('btn-submit-booking');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Securing Food Reservation... ⏳</span>`;

    setTimeout(() => {
      // 1. Decrement listing quantity in store
      const listings = Store.getListings();
      const listingIndex = listings.findIndex(l => l.id === item.id);
      if (listingIndex !== -1) {
        listings[listingIndex].quantity = Math.max(0, listings[listingIndex].quantity - qty);
        if (listings[listingIndex].quantity === 0) {
          listings[listingIndex].status = 'sold-out';
        }
        Store.saveListings(listings);
      }

      // 2. Create new booking record
      const isDonate = item.listingType === 'donate';
      const pickupCode = generatePickupCode();
      const bookingId = generateBookingId();
      const unitPrice = isDonate ? 0 : item.discountedPrice;
      const totalPrice = unitPrice * qty;
      const moneySaved = (item.originalPrice - unitPrice) * qty;
      const wasteSavedKg = Number((0.6 * qty).toFixed(1));

      const newOrder = {
        id: bookingId,
        pickupCode: pickupCode,
        foodId: item.id,
        foodTitle: item.title,
        foodImage: item.image,
        listingType: item.listingType || (isDonate ? 'donate' : 'sell'),
        sellerId: item.sellerId || item.restaurantId,
        sellerName: item.sellerName || item.restaurantName,
        sellerAddress: item.location || item.restaurantAddress || 'Indiranagar, Bengaluru',
        sellerPhone: item.sellerPhone || '+91 98451 23456',
        reserverName: user.name,
        reserverEmail: user.email,
        reserverPhone: user.phone || '+91 98765 43210',
        reserverRole: user.role,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '+91 98765 43210',
        quantity: qty,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        moneySaved: moneySaved,
        wasteSavedKg: wasteSavedKg,
        paymentMethod: isDonate ? '100% Free Donated Food' : 'Pay Directly at Pickup (Cash / UPI)',
        pickupStart: item.pickupStart,
        pickupEnd: item.pickupEnd,
        lastCollectionTime: item.lastCollectionTime || item.pickupEnd,
        createdAt: new Date().toISOString(),
        status: 'ready_for_pickup'
      };

      const orders = Store.getOrders();
      orders.unshift(newOrder);
      Store.saveOrders(orders);

      // 3. Update global impact counters
      const impact = Store.getImpact();
      impact.mealsRescued += qty;
      impact.kgWastePrevented = Number((impact.kgWastePrevented + wasteSavedKg).toFixed(1));
      impact.co2MitigatedKg = Number((impact.co2MitigatedKg + wasteSavedKg * 2.5).toFixed(1));
      impact.moneySavedRupees += moneySaved;
      Store.saveImpact(impact);

      // 4. Update customer / org personal metrics
      if (user.role === 'customer' || user.role === 'organization') {
        user.savedKg = Number(((user.savedKg || 0) + wasteSavedKg).toFixed(1));
        user.savedMoney = (user.savedMoney || 0) + moneySaved;
        Store.setUser(user);

        const users = Store.getUsers();
        const uIdx = users.findIndex(u => u.email === user.email);
        if (uIdx !== -1) {
          users[uIdx].savedKg = user.savedKg;
          users[uIdx].savedMoney = user.savedMoney;
          Store.saveUsers(users);
        }
      }

      // Close checkout modal & open confirmation modal
      closeModal('modal-checkout');
      showConfirmationModal(newOrder);

      // Refresh displays
      updateAuthUI();
      renderFeaturedFood();
      renderMarketplace();
      renderGlobalImpactStats();
      if (user.role === 'organization') {
        renderOrganizationDashboard();
      }

      showToast(`Reservation confirmed! Pickup code: ${pickupCode}`, 'success', 5000);
    }, 600);
  }

  function showConfirmationModal(order) {
    const codeBox = document.getElementById('confirm-code-box');
    const instructions = document.getElementById('confirm-pickup-instructions');

    codeBox.innerHTML = `
      <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary-dark); text-transform: uppercase; letter-spacing: 1px;">
        Show This Code At Restaurant Pickup:
      </span>
      <span class="pickup-code-giant">${order.pickupCode}</span>
      
      <!-- Visual QR pattern simulation -->
      <div class="visual-qr-box">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect width="100" height="100" fill="white"/>
          <!-- QR corners -->
          <rect x="10" y="10" width="24" height="24" fill="#064E3B"/>
          <rect x="14" y="14" width="16" height="16" fill="white"/>
          <rect x="18" y="18" width="8" height="8" fill="#064E3B"/>

          <rect x="66" y="10" width="24" height="24" fill="#064E3B"/>
          <rect x="70" y="14" width="16" height="16" fill="white"/>
          <rect x="74" y="18" width="8" height="8" fill="#064E3B"/>

          <rect x="10" y="66" width="24" height="24" fill="#064E3B"/>
          <rect x="14" y="70" width="16" height="16" fill="white"/>
          <rect x="18" y="74" width="8" height="8" fill="#064E3B"/>

          <!-- Dynamic pixel blocks -->
          <rect x="42" y="15" width="6" height="6" fill="#064E3B"/>
          <rect x="52" y="25" width="6" height="6" fill="#064E3B"/>
          <rect x="40" y="42" width="20" height="20" fill="#10B981" rx="4"/>
          <rect x="70" y="50" width="8" height="8" fill="#064E3B"/>
          <rect x="80" y="70" width="8" height="8" fill="#064E3B"/>
          <rect x="50" y="75" width="8" height="8" fill="#064E3B"/>
        </svg>
      </div>

      <div style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">
        Booking ID: <strong>${order.id}</strong> • Amount: <strong>${formatCurrency(order.totalPrice)}</strong>
      </div>
    `;

    instructions.innerHTML = `
      <div style="background: var(--color-surface-subtle); padding: 1rem; border-radius: var(--radius-md); font-size: 0.875rem; text-align: left; margin-bottom: 1.5rem;">
        <div>📍 <strong>Pickup Venue:</strong> ${order.restaurantName}</div>
        <div style="margin-top: 0.25rem;">🏠 <strong>Address:</strong> ${order.restaurantAddress}</div>
        <div style="margin-top: 0.25rem;">🕒 <strong>Collection Window:</strong> Today, ${order.pickupStart} – ${order.pickupEnd}</div>
        <div style="margin-top: 0.25rem;">📦 <strong>Rescued Item:</strong> ${order.quantity}x ${order.foodTitle}</div>
      </div>
    `;

    openModal('modal-confirmation');

    document.getElementById('btn-confirm-view-orders').onclick = () => {
      closeModal('modal-confirmation');
      window.location.hash = 'customer-dashboard';
    };

    document.getElementById('btn-confirm-continue').onclick = () => {
      closeModal('modal-confirmation');
      window.location.hash = 'marketplace';
    };
  }

  // --------------------------------------------------------------------------
  // 10. CUSTOMER DASHBOARD RENDERING & ORDER MANAGEMENT
  // --------------------------------------------------------------------------
  function renderCustomerDashboard() {
    const user = AppState.currentUser;
    if (!user) return;

    // Profile Display
    document.getElementById('customer-name-display').textContent = user.name.split(' ')[0];
    document.getElementById('customer-profile-avatar').src = user.avatar;

    // Contact Form Populate
    document.getElementById('cust-prof-name').value = user.name;
    document.getElementById('cust-prof-phone').value = user.phone || '';
    document.getElementById('cust-prof-email').value = user.email;
    document.getElementById('cust-prof-city').value = user.city || 'Indiranagar, Bengaluru';

    // Orders Filter for this user
    const orders = Store.getOrders();
    const myOrders = orders.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase());

    const activeOrders = myOrders.filter(o => o.status === 'ready_for_pickup');
    const pastOrders = myOrders.filter(o => o.status !== 'ready_for_pickup');

    // Metrics Calculation
    const totalMoneySaved = myOrders.reduce((sum, o) => o.status === 'collected' ? sum + (o.moneySaved || 0) : sum, 0);
    const totalWasteRescued = myOrders.reduce((sum, o) => o.status === 'collected' ? sum + (o.wasteSavedKg || 0) : sum, 0);

    document.getElementById('cust-stat-total-orders').textContent = myOrders.length;
    document.getElementById('cust-stat-active-orders').textContent = activeOrders.length;
    document.getElementById('cust-stat-money-saved').textContent = formatCurrency(totalMoneySaved);
    document.getElementById('cust-stat-waste-saved').textContent = totalWasteRescued.toFixed(1) + ' kg';

    document.getElementById('tab-active-count').textContent = activeOrders.length;
    document.getElementById('tab-history-count').textContent = pastOrders.length;

    // Render Active Pickups Tab
    const activeList = document.getElementById('active-orders-list');
    if (activeOrders.length === 0) {
      activeList.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🛍️</div>
          <h3>No active surplus pickups right now</h3>
          <p>Explore today's surplus bags from bakeries and restaurants near you.</p>
          <button type="button" class="btn btn-primary" onclick="window.location.hash='marketplace'">Explore Food Marketplace</button>
        </div>
      `;
    } else {
      activeList.innerHTML = activeOrders.map(order => `
        <div class="order-card" data-order-id="${order.id}">
          <img src="${order.foodImage}" alt="${order.foodTitle}" class="order-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
          <div class="order-info">
            <span class="order-status-badge status-ready">Ready for Pickup</span>
            <h4 style="margin-top: 0.35rem;">${order.foodTitle}</h4>
            <div class="order-rest-line">🏪 ${order.restaurantName}</div>
            <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
              📍 ${order.restaurantAddress}
            </div>
            <div class="order-details-meta">
              <span>Qty: <strong>${order.quantity} bag(s)</strong></span>
              <span>Total Paid: <strong>${formatCurrency(order.totalPrice)}</strong></span>
              <span>Pickup: <strong>${order.pickupStart} – ${order.pickupEnd}</strong></span>
            </div>
          </div>
          <div class="order-code-panel">
            <span class="code-title">YOUR PICKUP CODE:</span>
            <span class="code-value">${order.pickupCode}</span>
            <small style="color: var(--color-primary-dark); font-size: 0.75rem;">Show to counter staff</small>
            <button type="button" class="btn btn-outline btn-sm btn-cancel-order" data-order-id="${order.id}" style="margin-top: 0.5rem; font-size: 0.75rem; border-color: var(--color-danger); color: var(--color-danger);">
              Cancel Reservation
            </button>
          </div>
        </div>
      `).join('');

      // Attach cancel listeners
      activeList.querySelectorAll('.btn-cancel-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const orderId = e.currentTarget.getAttribute('data-order-id');
          handleCancelOrder(orderId);
        });
      });
    }

    // Render History Tab
    const historyList = document.getElementById('history-orders-list');
    if (pastOrders.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">📜</div>
          <h3>No past reservations yet</h3>
          <p>Completed and cancelled bookings will appear here for your records.</p>
        </div>
      `;
    } else {
      historyList.innerHTML = pastOrders.map(order => `
        <div class="order-card" style="opacity: ${order.status === 'cancelled' ? '0.7' : '1'};">
          <img src="${order.foodImage}" alt="${order.foodTitle}" class="order-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
          <div class="order-info">
            <span class="order-status-badge ${order.status === 'collected' ? 'status-completed' : 'status-cancelled'}">
              ${order.status === 'collected' ? '✅ Food Rescued & Collected' : '❌ Cancelled'}
            </span>
            <h4 style="margin-top: 0.35rem;">${order.foodTitle}</h4>
            <div class="order-rest-line">🏪 ${order.restaurantName}</div>
            <div class="order-details-meta" style="margin-top: 0.5rem;">
              <span>Booking ID: <strong>${order.id}</strong></span>
              <span>Paid: <strong>${formatCurrency(order.totalPrice)}</strong></span>
              <span>Method: <strong>${order.paymentMethod}</strong></span>
            </div>
          </div>
          <div style="text-align: right; display: flex; flex-direction: column; justify-content: center; gap: 0.35rem;">
            ${order.status === 'collected' 
              ? `<span style="font-weight: 700; color: var(--color-primary-dark); font-size: 0.85rem;">🌱 ${order.wasteSavedKg} kg waste saved</span>
                 <span style="font-size: 0.8rem; color: var(--color-text-muted);">Saved ${formatCurrency(order.moneySaved)}</span>`
              : `<span style="color: var(--color-danger); font-size: 0.85rem; font-weight: 600;">Refunded to source</span>`}
          </div>
        </div>
      `).join('');
    }
  }

  function handleCancelOrder(orderId) {
    confirmAction('Cancel Food Reservation', 'Are you sure you want to cancel this booking? The portion will be returned to the surplus marketplace.', () => {
      const orders = Store.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      order.status = 'cancelled';
      Store.saveOrders(orders);

      // Return quantity to food listing
      const listings = Store.getListings();
      const listing = listings.find(l => l.id === order.foodId);
      if (listing) {
        listing.quantity += order.quantity;
        if (listing.status === 'sold-out' && listing.quantity > 0) {
          listing.status = 'available';
        }
        Store.saveListings(listings);
      }

      showToast(`Reservation #${order.id} has been cancelled.`, 'info');
      renderCustomerDashboard();
      renderFeaturedFood();
      renderMarketplace();
      updateAuthUI();
    });
  }

  // --------------------------------------------------------------------------
  // 11. FOOD SELLER DASHBOARD & COUNTER PICKUP VERIFICATION TOOL
  // --------------------------------------------------------------------------
  function renderRestaurantDashboard() {
    const user = AppState.currentUser;
    if (!user || (user.role !== 'restaurant' && user.role !== 'seller')) return;

    const restName = user.restaurantName || user.sellerName || user.name;
    const nameDisplay = document.getElementById('restaurant-name-display');
    if (nameDisplay) nameDisplay.textContent = restName;
    const avatarEl = document.getElementById('restaurant-profile-avatar');
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;

    // Contact Form Populate
    if (document.getElementById('rest-prof-name')) document.getElementById('rest-prof-name').value = restName;
    if (document.getElementById('rest-prof-owner')) document.getElementById('rest-prof-owner').value = user.owner || user.name;
    if (document.getElementById('rest-prof-phone')) document.getElementById('rest-prof-phone').value = user.phone || '';
    if (document.getElementById('rest-prof-email')) document.getElementById('rest-prof-email').value = user.email;
    if (document.getElementById('rest-prof-address')) document.getElementById('rest-prof-address').value = user.address || 'Indiranagar, Bengaluru';
    if (document.getElementById('rest-prof-cuisine')) document.getElementById('rest-prof-cuisine').value = user.cuisines || 'South Indian Tiffin, Meals';

    // Auto-fill new listing seller inputs with user info
    if (document.getElementById('new-food-seller-name')) document.getElementById('new-food-seller-name').value = restName;
    if (document.getElementById('new-food-seller-phone')) document.getElementById('new-food-seller-phone').value = user.phone || '';
    if (document.getElementById('new-food-location')) document.getElementById('new-food-location').value = user.address || 'Near Indiranagar Metro, Bengaluru';

    // Listings owned by this seller
    const allListings = Store.getListings();
    const myListings = allListings.filter(l => 
      (l.sellerId && l.sellerId === user.restaurantId) ||
      (l.restaurantId && l.restaurantId === user.restaurantId) ||
      (l.sellerName && l.sellerName.toLowerCase() === restName.toLowerCase()) ||
      (l.restaurantName && l.restaurantName.toLowerCase() === restName.toLowerCase())
    );

    // Orders for this seller
    const allOrders = Store.getOrders();
    const myOrders = allOrders.filter(o => 
      (o.sellerId && o.sellerId === user.restaurantId) ||
      (o.restaurantId && o.restaurantId === user.restaurantId) ||
      (o.sellerName && o.sellerName.toLowerCase() === restName.toLowerCase()) ||
      (o.restaurantName && o.restaurantName.toLowerCase() === restName.toLowerCase())
    );

    const pendingOrders = myOrders.filter(o => o.status === 'ready_for_pickup');
    const completedOrders = myOrders.filter(o => o.status === 'collected');

    // Revenue & Food saved metrics
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalFoodSavedKg = completedOrders.reduce((sum, o) => sum + (o.wasteSavedKg || 0), 0);

    const activeListingsEl = document.getElementById('rest-stat-active-listings');
    if (activeListingsEl) activeListingsEl.textContent = myListings.filter(l => l.status === 'available').length;
    const pendingPickupsEl = document.getElementById('rest-stat-pending-pickups');
    if (pendingPickupsEl) pendingPickupsEl.textContent = pendingOrders.length;
    const completedPickupsEl = document.getElementById('rest-stat-completed-pickups');
    if (completedPickupsEl) completedPickupsEl.textContent = completedOrders.length;
    const revenueEl = document.getElementById('rest-stat-revenue');
    if (revenueEl) revenueEl.textContent = formatCurrency(totalRevenue);
    const wasteSavedEl = document.getElementById('rest-stat-waste-saved');
    if (wasteSavedEl) wasteSavedEl.textContent = totalFoodSavedKg.toFixed(1) + ' kg';

    const ordersCountEl = document.getElementById('rest-tab-orders-count');
    if (ordersCountEl) ordersCountEl.textContent = myOrders.length;
    const listingsCountEl = document.getElementById('rest-tab-listings-count');
    if (listingsCountEl) listingsCountEl.textContent = myListings.length;

    // 1. Render Manage Listings Table
    const listingsWrap = document.getElementById('rest-listings-table-wrap');
    if (listingsWrap) {
      if (myListings.length === 0) {
        listingsWrap.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">🍱</div>
            <h3>No food listings added yet</h3>
            <p>Publish remaining fresh food to SELL at discounted rates or DONATE for free.</p>
            <button type="button" class="btn btn-primary" id="btn-empty-add-listing">Add Surplus Food Listing</button>
          </div>
        `;
        document.getElementById('btn-empty-add-listing')?.addEventListener('click', () => {
          document.querySelector('[data-rest-tab="add-new-listing"]')?.click();
        });
      } else {
        listingsWrap.innerHTML = `
          <table class="data-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Type</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>Available Portions</th>
                <th>Pickup Window</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${myListings.map(item => `
                <tr data-listing-id="${item.id}">
                  <td>
                    <div class="table-food-item">
                      <img src="${item.image}" alt="${item.title}" class="table-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'">
                      <div>
                        <strong>${item.title}</strong>
                        <span style="display: block; font-size: 0.75rem; color: var(--color-text-muted);">${item.diet === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    ${item.listingType === 'donate' 
                      ? `<span class="badge-tag" style="background: #E8F5E9; color: #1E3A2F; font-size: 0.75rem;">🎁 Free Donate</span>`
                      : `<span class="badge-tag" style="background: #FEF3C7; color: #92400E; font-size: 0.75rem;">💰 Sell (${item.discountPercent}% Off)</span>`
                    }
                  </td>
                  <td><span class="food-card-category-tag">${item.category}</span></td>
                  <td>
                    ${item.listingType === 'donate'
                      ? `<strong style="color: #2D6A4F;">₹0 (Free)</strong>`
                      : `<strong>${formatCurrency(item.discountedPrice)}</strong>
                         <small style="display: block; text-decoration: line-through; color: var(--color-text-light);">${formatCurrency(item.originalPrice)}</small>`
                    }
                  </td>
                  <td>
                    <div class="qty-counter">
                      <button type="button" class="qty-btn btn-stock-minus" data-id="${item.id}">-</button>
                      <strong>${item.quantity}</strong>
                      <button type="button" class="qty-btn btn-stock-plus" data-id="${item.id}">+</button>
                    </div>
                  </td>
                  <td>${item.pickupStart} – ${item.pickupEnd}</td>
                  <td>
                    <span class="order-status-badge ${item.quantity > 0 && item.status === 'available' ? 'status-completed' : 'status-cancelled'}">
                      ${item.quantity > 0 && item.status === 'available' ? 'Active' : 'Sold Out'}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button type="button" class="btn btn-secondary btn-sm btn-edit-listing" data-id="${item.id}">Edit</button>
                      <button type="button" class="btn btn-outline btn-sm btn-delete-listing" data-id="${item.id}" style="color: var(--color-danger); border-color: var(--color-danger);">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        attachListingTableListeners(listingsWrap);
      }
    }

    // 2. Render Incoming Reservations Table
    const ordersWrap = document.getElementById('rest-orders-table-wrap');
    if (ordersWrap) {
      if (myOrders.length === 0) {
        ordersWrap.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">📋</div>
            <h3>No reservations yet</h3>
            <p>Customer and organization reservations with pickup codes will appear here in real-time.</p>
          </div>
        `;
      } else {
        ordersWrap.innerHTML = `
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Reserver</th>
                <th>Type</th>
                <th>Reserved Food</th>
                <th>Qty</th>
                <th>Pickup Code</th>
                <th>Counter Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${myOrders.map(order => `
                <tr data-order-id="${order.id}">
                  <td><strong>${order.id}</strong></td>
                  <td>
                    <strong>${order.reserverName || order.customerName}</strong>
                    <span style="display: block; font-size: 0.75rem; color: var(--color-text-muted);">${order.reserverPhone || order.customerPhone}</span>
                  </td>
                  <td>
                    ${order.reserverRole === 'organization'
                      ? `<span class="badge-tag" style="background: #E8F5E9; color: #1E3A2F; font-size: 0.75rem;">🏛️ Org</span>`
                      : `<span class="badge-tag" style="background: #E0E7FF; color: #3730A3; font-size: 0.75rem;">👤 Customer</span>`
                    }
                  </td>
                  <td>${order.foodTitle}</td>
                  <td><strong>${order.quantity}</strong></td>
                  <td>
                    <span style="font-family: monospace; font-weight: 800; background: var(--color-primary-light); color: var(--color-primary-darker); padding: 0.2rem 0.5rem; border-radius: var(--radius-xs); letter-spacing: 1px;">
                      ${order.pickupCode}
                    </span>
                  </td>
                  <td>
                    ${order.listingType === 'donate' || order.totalPrice === 0
                      ? `<strong style="color: #2D6A4F;">₹0 (Free Claim)</strong>`
                      : `<strong>${formatCurrency(order.totalPrice)}</strong> <small style="display:block; font-size: 0.7rem; color: var(--color-text-muted);">(Collect via Cash/UPI)</small>`
                    }
                  </td>
                  <td>
                    <span class="order-status-badge ${order.status === 'collected' ? 'status-completed' : order.status === 'ready_for_pickup' ? 'status-ready' : 'status-cancelled'}">
                      ${order.status === 'collected' ? 'Collected' : order.status === 'ready_for_pickup' ? 'Pending Pickup' : 'Cancelled'}
                    </span>
                  </td>
                  <td>
                    ${order.status === 'ready_for_pickup' 
                      ? `<button type="button" class="btn btn-primary btn-sm btn-collect-order" data-code="${order.pickupCode}">Verify Code</button>`
                      : `<span style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600;">Completed</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;

        ordersWrap.querySelectorAll('.btn-collect-order').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const code = e.currentTarget.getAttribute('data-code');
            document.getElementById('verify-code-input').value = code;
            handleVerifyPickupCode(code);
          });
        });
      }
    }
  }

  function attachListingTableListeners(container) {
    // Stock + / -
    container.querySelectorAll('.btn-stock-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        modifyListingStock(id, 1);
      });
    });

    container.querySelectorAll('.btn-stock-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        modifyListingStock(id, -1);
      });
    });

    // Delete
    container.querySelectorAll('.btn-delete-listing').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        confirmAction('Delete Surplus Listing', 'Are you sure you want to remove this food listing from the marketplace?', () => {
          let listings = Store.getListings();
          listings = listings.filter(l => l.id !== id);
          Store.saveListings(listings);
          showToast('Listing successfully deleted.', 'info');
          renderRestaurantDashboard();
          renderMarketplace();
          renderFeaturedFood();
          renderOrganizationDashboard();
        });
      });
    });

    // Edit
    container.querySelectorAll('.btn-edit-listing').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openEditListingModal(id);
      });
    });
  }

  function modifyListingStock(id, delta) {
    const listings = Store.getListings();
    const item = listings.find(l => l.id === id);
    if (!item) return;

    item.quantity = Math.max(0, item.quantity + delta);
    if (item.quantity === 0) {
      item.status = 'sold-out';
    } else {
      item.status = 'available';
    }

    Store.saveListings(listings);
    renderRestaurantDashboard();
    renderMarketplace();
    renderFeaturedFood();
    renderOrganizationDashboard();
    showToast(`Stock updated: ${item.quantity} portions available.`, 'info');
  }

  function openEditListingModal(id) {
    const listings = Store.getListings();
    const item = listings.find(l => l.id === id);
    if (!item) return;

    document.getElementById('edit-food-id').value = item.id;
    document.getElementById('edit-food-title').value = item.title;
    document.getElementById('edit-food-orig-price').value = item.originalPrice;
    document.getElementById('edit-food-disc-price').value = item.discountedPrice;
    document.getElementById('edit-food-quantity').value = item.quantity;
    document.getElementById('edit-food-status').value = item.status;
    document.getElementById('edit-food-pickup-start').value = item.pickupStart;
    document.getElementById('edit-food-pickup-end').value = item.pickupEnd;

    openModal('modal-edit-listing');
  }

  // Quick Pickup Code Verification Tool Handler
  function handleVerifyPickupCode(code) {
    const feedbackEl = document.getElementById('verification-feedback');
    feedbackEl.classList.remove('hidden', 'feedback-success', 'feedback-error');

    if (!code || !code.trim()) {
      feedbackEl.classList.add('feedback-error');
      feedbackEl.textContent = 'Please enter a valid pickup code.';
      return;
    }

    const cleanCode = code.trim().toUpperCase();
    const orders = Store.getOrders();
    const targetOrder = orders.find(o => o.pickupCode === cleanCode);

    if (!targetOrder) {
      feedbackEl.classList.add('feedback-error');
      feedbackEl.textContent = `❌ Invalid Code: No reservation found with code "${cleanCode}".`;
      showToast(`Invalid pickup code: ${cleanCode}`, 'error');
      return;
    }

    if (targetOrder.status === 'collected') {
      feedbackEl.classList.add('feedback-error');
      feedbackEl.textContent = `⚠️ Code Already Used: Order #${targetOrder.id} was already collected on ${new Date(targetOrder.createdAt).toLocaleDateString()}.`;
      showToast(`Order already marked collected`, 'warning');
      return;
    }

    if (targetOrder.status === 'cancelled') {
      feedbackEl.classList.add('feedback-error');
      feedbackEl.textContent = `❌ Reservation Cancelled: Order #${targetOrder.id} was cancelled by the reserver.`;
      showToast(`Reservation cancelled`, 'error');
      return;
    }

    // Success! Mark order as collected
    targetOrder.status = 'collected';
    targetOrder.collectedAt = new Date().toISOString();
    Store.saveOrders(orders);

    const isDonation = targetOrder.listingType === 'donate' || targetOrder.totalPrice === 0;
    const reserverDisplay = targetOrder.reserverName || targetOrder.customerName;
    const rolePill = targetOrder.reserverRole === 'organization' ? '🏛️ Organization' : '👤 Customer';

    feedbackEl.classList.add('feedback-success');
    feedbackEl.innerHTML = `
      🎉 <strong>Verification Successful!</strong><br>
      • Reserver: <strong>${reserverDisplay}</strong> (${rolePill})<br>
      • Food: <strong>${targetOrder.quantity}x ${targetOrder.foodTitle}</strong><br>
      • Handover Action: <strong>${isDonation ? '🎁 Hand over 100% FREE donation (₹0)' : `💵 Collect direct payment of ${formatCurrency(targetOrder.totalPrice)} via UPI/Cash`}</strong>.
    `;

    document.getElementById('verify-code-input').value = '';
    showToast(`Order #${targetOrder.id} verified! Hand over ${targetOrder.quantity} portions to ${reserverDisplay}.`, 'success', 5000);

    // Refresh metrics & UI
    renderRestaurantDashboard();
    renderCustomerDashboard();
    renderOrganizationDashboard();
    renderGlobalImpactStats();
  }

  // --------------------------------------------------------------------------
  // 12. ORGANIZATION DASHBOARD (HOSTELS, ASHRAMS, ORPHANAGES, NGOS)
  // --------------------------------------------------------------------------
  function renderOrganizationDashboard() {
    const user = AppState.currentUser;
    if (!user || user.role !== 'organization') return;

    const orgName = user.orgName || user.name;
    const orgNameEl = document.getElementById('org-name-display');
    if (orgNameEl) orgNameEl.textContent = orgName;
    const orgAvatarEl = document.getElementById('org-profile-avatar');
    if (orgAvatarEl && user.avatar) orgAvatarEl.src = user.avatar;

    // Contact Form Populate
    if (document.getElementById('org-prof-name')) document.getElementById('org-prof-name').value = orgName;
    if (document.getElementById('org-prof-type')) document.getElementById('org-prof-type').value = user.orgType || 'Student Hostel';
    if (document.getElementById('org-prof-rep')) document.getElementById('org-prof-rep').value = user.name;
    if (document.getElementById('org-prof-phone')) document.getElementById('org-prof-phone').value = user.phone || '';
    if (document.getElementById('org-prof-email')) document.getElementById('org-prof-email').value = user.email;
    if (document.getElementById('org-prof-address')) document.getElementById('org-prof-address').value = user.address || 'Defence Colony, Indiranagar, Bengaluru';

    // Orders claimed by this organization
    const allOrders = Store.getOrders();
    const myClaims = allOrders.filter(o => 
      o.reserverRole === 'organization' || 
      (o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) || 
      (o.reserverEmail && o.reserverEmail.toLowerCase() === user.email.toLowerCase())
    );

    const pendingClaims = myClaims.filter(o => o.status === 'ready_for_pickup');
    const completedClaims = myClaims.filter(o => o.status === 'collected');
    const totalClaimedMeals = myClaims.reduce((sum, o) => sum + o.quantity, 0);
    const totalKgSaved = myClaims.reduce((sum, o) => sum + (o.wasteSavedKg || 0), 0);
    const totalCommunityValue = myClaims.reduce((sum, o) => sum + (o.moneySaved || 0), 0);

    const claimedMealsEl = document.getElementById('org-stat-claimed-meals');
    if (claimedMealsEl) claimedMealsEl.textContent = totalClaimedMeals;
    const orgPendingPickupsEl = document.getElementById('org-stat-pending-pickups');
    if (orgPendingPickupsEl) orgPendingPickupsEl.textContent = pendingClaims.length;
    const orgWasteSavedEl = document.getElementById('org-stat-waste-saved');
    if (orgWasteSavedEl) orgWasteSavedEl.textContent = totalKgSaved.toFixed(1) + ' kg';
    const orgSavingsEl = document.getElementById('org-stat-savings');
    if (orgSavingsEl) orgSavingsEl.textContent = formatCurrency(totalCommunityValue);

    // Available donated food listings
    const allListings = Store.getListings();
    const freeDonations = allListings.filter(l => l.listingType === 'donate' && l.status === 'available' && l.quantity > 0);

    const availCountEl = document.getElementById('org-tab-available-count');
    if (availCountEl) availCountEl.textContent = freeDonations.length;
    const reqsCountEl = document.getElementById('org-tab-requests-count');
    if (reqsCountEl) reqsCountEl.textContent = myClaims.length;

    // Render Tab 1: Available Donated Food Grid
    const donationsGrid = document.getElementById('org-donations-grid');
    const donationsEmpty = document.getElementById('org-donations-empty');

    if (donationsGrid) {
      if (freeDonations.length === 0) {
        donationsGrid.innerHTML = '';
        donationsEmpty?.classList.remove('hidden');
      } else {
        donationsEmpty?.classList.add('hidden');
        donationsGrid.innerHTML = freeDonations.map(createFoodCardHTML).join('');
        attachFoodCardListeners(donationsGrid);
      }
    }

    // Render Tab 2: Claimed Requests & Pickup Codes
    const requestsList = document.getElementById('org-requests-list');
    if (requestsList) {
      if (myClaims.length === 0) {
        requestsList.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">📋</div>
            <h3>No Free Food Claims Yet</h3>
            <p>Browse available food donations and submit a free claim for your hostel, ashram or orphanage.</p>
          </div>
        `;
      } else {
        requestsList.innerHTML = myClaims.map(order => `
          <div class="org-request-card" data-order-id="${order.id}">
            <img src="${order.foodImage}" alt="${order.foodTitle}" class="org-request-card-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                <div>
                  <span class="badge-tag" style="background: #E8F5E9; color: #1E3A2F; margin-bottom: 0.25rem;">🎁 100% FREE DONATION</span>
                  <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">${order.foodTitle}</h4>
                  <div style="font-size: 0.85rem; color: var(--color-primary-dark); font-weight: 600;">
                    Donor: ${order.sellerName || order.restaurantName} (📞 ${order.sellerPhone || '+91 98451 23456'})
                  </div>
                </div>
                <span class="order-status-badge ${order.status === 'collected' ? 'status-completed' : 'status-ready'}">
                  ${order.status === 'collected' ? 'Collected' : 'Ready For Pickup'}
                </span>
              </div>
              <div style="font-size: 0.82rem; color: var(--color-text-muted); margin-top: 0.4rem;">
                📍 Pickup: <strong>${order.sellerAddress || order.restaurantAddress}</strong> • Today <strong>${order.pickupStart} – ${order.pickupEnd}</strong>
              </div>
              <div style="margin-top: 0.6rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span>Portions: <strong>${order.quantity}</strong></span>
                <span>Cost: <strong style="color: #2D6A4F;">₹0 (Free)</strong></span>
                <span>Pickup Code: <strong class="org-code-badge">${order.pickupCode}</strong></span>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 13. ADD NEW FOOD LISTING (SELL OR DONATE)
  // --------------------------------------------------------------------------
  function setupAddListingForm() {
    const form = document.getElementById('form-add-food-listing');
    if (!form) return;

    const origPriceInput = document.getElementById('new-food-original-price');
    const discPriceInput = document.getElementById('new-food-discounted-price');
    const groupDiscPrice = document.getElementById('group-discounted-price');
    const discountDisplay = document.getElementById('auto-discount-display');
    const savingsDisplay = document.getElementById('auto-savings-display');
    const labelDiscountCalc = document.getElementById('label-discount-calc');
    const presetGrid = document.getElementById('food-image-preset-grid');
    const customImgInput = document.getElementById('new-food-custom-img');
    const submitBtn = document.getElementById('btn-submit-new-listing');

    const cardSell = document.getElementById('type-card-sell');
    const cardDonate = document.getElementById('type-card-donate');

    let selectedImg = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80';

    // Listing Type Toggle (Sell vs Donate)
    const updateListingTypeUI = () => {
      const selectedType = form.querySelector('input[name="new-listing-type"]:checked')?.value || 'sell';
      if (selectedType === 'donate') {
        cardDonate?.classList.add('active');
        cardSell?.classList.remove('active');
        if (groupDiscPrice) groupDiscPrice.style.display = 'none';
        if (discPriceInput) {
          discPriceInput.value = '0';
          discPriceInput.removeAttribute('required');
        }
        if (labelDiscountCalc) labelDiscountCalc.textContent = 'Listing Mode: ';
        if (discountDisplay) discountDisplay.textContent = '100% FREE';
        if (savingsDisplay) savingsDisplay.textContent = '(Free Food Donation for Community Organizations)';
        if (submitBtn) submitBtn.textContent = 'Publish Free Food Donation to Marketplace';
      } else {
        cardSell?.classList.add('active');
        cardDonate?.classList.remove('active');
        if (groupDiscPrice) groupDiscPrice.style.display = 'block';
        if (discPriceInput) {
          discPriceInput.setAttribute('required', 'required');
          if (discPriceInput.value === '0') discPriceInput.value = '';
        }
        if (labelDiscountCalc) labelDiscountCalc.textContent = 'Calculated Surplus Discount: ';
        calculateDiscount();
        if (submitBtn) submitBtn.textContent = 'Publish Discounted Food to Marketplace';
      }
    };

    form.querySelectorAll('input[name="new-listing-type"]').forEach(radio => {
      radio.addEventListener('change', updateListingTypeUI);
    });
    cardSell?.addEventListener('click', () => {
      const radio = cardSell.querySelector('input');
      if (radio) { radio.checked = true; updateListingTypeUI(); }
    });
    cardDonate?.addEventListener('click', () => {
      const radio = cardDonate.querySelector('input');
      if (radio) { radio.checked = true; updateListingTypeUI(); }
    });

    // Image preset click
    if (presetGrid) {
      presetGrid.querySelectorAll('.food-img-preset').forEach(preset => {
        preset.addEventListener('click', () => {
          presetGrid.querySelectorAll('.food-img-preset').forEach(p => p.classList.remove('active'));
          preset.classList.add('active');
          selectedImg = preset.getAttribute('data-img');
          if (customImgInput) customImgInput.value = '';
        });
      });
    }

    customImgInput?.addEventListener('input', () => {
      if (customImgInput.value.trim()) {
        presetGrid?.querySelectorAll('.food-img-preset').forEach(p => p.classList.remove('active'));
        selectedImg = customImgInput.value.trim();
      }
    });

    // Auto-calculate discount percentage & auto-suggest ~50%
    const calculateDiscount = () => {
      const selectedType = form.querySelector('input[name="new-listing-type"]:checked')?.value || 'sell';
      if (selectedType === 'donate') {
        if (discountDisplay) discountDisplay.textContent = '100% FREE';
        if (savingsDisplay) savingsDisplay.textContent = '(100% Free Community Donation)';
        return;
      }

      const orig = Number(origPriceInput?.value) || 0;
      let disc = Number(discPriceInput?.value);

      // Auto-suggest 50% discount if selling price is empty and original price entered
      if (orig > 0 && (discPriceInput.value === '' || isNaN(disc))) {
        disc = Math.round(orig * 0.5);
        discPriceInput.value = disc;
      }

      if (orig > 0 && disc > 0 && orig > disc) {
        const percent = Math.round(((orig - disc) / orig) * 100);
        if (discountDisplay) discountDisplay.textContent = `${percent}% OFF`;
        if (savingsDisplay) savingsDisplay.textContent = `(You will save customer ${formatCurrency(orig - disc)})`;
      } else {
        if (discountDisplay) discountDisplay.textContent = '0% OFF';
        if (savingsDisplay) savingsDisplay.textContent = '(Discounted price must be lower than original price)';
      }
    };

    origPriceInput?.addEventListener('input', calculateDiscount);
    discPriceInput?.addEventListener('input', calculateDiscount);

    // Submit form
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const user = AppState.currentUser;
      if (!user || (user.role !== 'restaurant' && user.role !== 'seller')) {
        showToast('Please log in with a food seller account to publish listings.', 'error');
        return;
      }

      const selectedType = form.querySelector('input[name="new-listing-type"]:checked')?.value || 'sell';
      const origPrice = Number(origPriceInput.value);
      let discPrice = Number(discPriceInput.value);

      if (selectedType === 'donate') {
        discPrice = 0;
      } else {
        if (discPrice >= origPrice || discPrice <= 0) {
          showToast('Discounted price must be lower than the original menu price.', 'error');
          return;
        }
      }

      const discountPercent = selectedType === 'donate' ? 100 : Math.round(((origPrice - discPrice) / origPrice) * 100);
      const sellerTitle = document.getElementById('new-food-seller-name')?.value.trim() || user.restaurantName || user.name;
      const sellerPhone = document.getElementById('new-food-seller-phone')?.value.trim() || user.phone || '+91 98451 23456';
      const pickupLoc = document.getElementById('new-food-location')?.value.trim() || user.address || 'Indiranagar, Bengaluru';
      const lastTime = document.getElementById('new-food-last-time')?.value || document.getElementById('new-food-pickup-end').value;

      const newListing = {
        id: 'food-' + Date.now(),
        title: document.getElementById('new-food-name').value.trim(),
        listingType: selectedType,
        sellerId: user.restaurantId || 'seller-1',
        sellerName: sellerTitle,
        sellerPhone: sellerPhone,
        restaurantId: user.restaurantId || 'seller-1',
        restaurantName: sellerTitle,
        restaurantAddress: pickupLoc,
        location: pickupLoc,
        category: document.getElementById('new-food-category').value,
        diet: document.getElementById('new-food-diet').value,
        originalPrice: origPrice,
        discountedPrice: discPrice,
        discountPercent: discountPercent,
        quantity: Number(document.getElementById('new-food-quantity').value),
        pickupStart: document.getElementById('new-food-pickup-start').value,
        pickupEnd: document.getElementById('new-food-pickup-end').value,
        lastCollectionTime: lastTime,
        distance: 0.8,
        status: 'available',
        image: selectedImg,
        description: document.getElementById('new-food-description').value.trim(),
        ingredients: 'Prepared freshly today in clean kitchen with food safety standards.',
        expiryNote: 'Safe to consume within safe shelf-life window.'
      };

      const listings = Store.getListings();
      listings.unshift(newListing);
      Store.saveListings(listings);

      form.reset();
      updateListingTypeUI();

      showToast(`"${newListing.title}" successfully published to marketplace as ${selectedType === 'donate' ? 'Free Donation' : `${discountPercent}% Off`}!`, 'success');

      // Switch to Manage Listings tab
      document.querySelector('[data-rest-tab="manage-listings"]')?.click();
      renderRestaurantDashboard();
      renderMarketplace();
      renderFeaturedFood();
      renderOrganizationDashboard();
    });
  }

  // --------------------------------------------------------------------------
  // 13. INTERACTIVE VISUAL MAP SIMULATION
  // --------------------------------------------------------------------------
  function renderMapPins() {
    const overlay = document.getElementById('map-pins-overlay');
    if (!overlay) return;

    const listings = Store.getListings();

    overlay.innerHTML = DEFAULT_SELLERS.map((rest, index) => {
      const restListings = listings.filter(l => 
        (l.restaurantId === rest.id || l.restaurantName.toLowerCase() === rest.name.toLowerCase()) && 
        l.status === 'available' && l.quantity > 0
      );
      const totalBags = restListings.reduce((sum, l) => sum + l.quantity, 0);

      // Percentage coordinate on overlay
      const leftPercent = (rest.mapCoords.x / 1000) * 100;
      const topPercent = (rest.mapCoords.y / 600) * 100;

      return `
        <div class="map-restaurant-pin" data-rest-id="${rest.id}" style="left: ${leftPercent}%; top: ${topPercent}%;">
          <div class="pin-bubble">
            <span>🏪 ${rest.name.split(' ')[0]}</span>
            <span style="background: var(--color-primary-dark); color: white; border-radius: 99px; padding: 0 4px; font-size: 0.65rem;">
              ${totalBags}
            </span>
          </div>
          <div class="pin-point"></div>
        </div>
      `;
    }).join('');

    // Attach pin click listener
    overlay.querySelectorAll('.map-restaurant-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        overlay.querySelectorAll('.map-restaurant-pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        const restId = pin.getAttribute('data-rest-id');
        showRestaurantMapPreview(restId);
      });
    });

    // Auto-select first restaurant for immediate inspection
    const firstPin = overlay.querySelector('.map-restaurant-pin');
    if (firstPin) {
      firstPin.click();
    }
  }

  function showRestaurantMapPreview(restId) {
    const rest = DEFAULT_SELLERS.find(r => r.id === restId);
    if (!rest) return;

    const emptyBox = document.getElementById('map-preview-empty');
    const activeBox = document.getElementById('map-preview-active');
    emptyBox.classList.add('hidden');
    activeBox.classList.remove('hidden');

    const listings = Store.getListings();
    const restListings = listings.filter(l => 
      (l.restaurantId === rest.id || l.restaurantName.toLowerCase() === rest.name.toLowerCase()) && 
      l.status === 'available' && l.quantity > 0
    );

    activeBox.innerHTML = `
      <div class="preview-rest-header">
        <img src="${rest.image}" alt="${rest.name}" class="preview-rest-img">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h3 style="font-size: 1.25rem; font-weight: 800;">${rest.name}</h3>
          <span style="color: #F59E0B; font-weight: 700;">★ ${rest.rating}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--color-primary-dark); font-weight: 600;">📍 ${rest.distance} km away • ${rest.address}</p>
        <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.25rem;">Cuisines: ${rest.cuisines}</p>
      </div>

      <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 1rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">
          Active Surplus Bags (${restListings.length})
        </h4>
        <div class="preview-food-list">
          ${restListings.length === 0 
            ? `<p style="font-size: 0.85rem; color: var(--color-text-muted);">All surplus bags from this eatery have been rescued today.</p>`
            : restListings.map(item => `
                <div class="preview-food-item">
                  <img src="${item.image}" alt="${item.title}">
                  <div style="flex: 1;">
                    <strong style="display: block; font-size: 0.9rem; line-height: 1.2;">${item.title}</strong>
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.35rem;">
                      <span style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary-dark);">${formatCurrency(item.discountedPrice)}</span>
                      <small style="color: var(--color-veg); font-weight: 700;">${item.discountPercent}% OFF</small>
                    </div>
                  </div>
                  <button type="button" class="btn btn-primary btn-sm btn-map-reserve" data-id="${item.id}" style="padding: 0.4rem 0.65rem; font-size: 0.8rem;">
                    Reserve
                  </button>
                </div>
              `).join('')}
        </div>
      </div>
    `;

    activeBox.querySelectorAll('.btn-map-reserve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        initiateReservation(id);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 14. SUSTAINABILITY & IMPACT DASHBOARD METRICS
  // --------------------------------------------------------------------------
  function renderGlobalImpactStats() {
    const impact = Store.getImpact();

    const mealsEl = document.getElementById('global-meals-rescued');
    const kgEl = document.getElementById('global-kg-saved');
    const co2El = document.getElementById('global-co2-saved');
    const moneyEl = document.getElementById('global-money-saved');
    const heroMeals = document.getElementById('hero-stat-meals');

    if (mealsEl) mealsEl.textContent = Number(impact.mealsRescued).toLocaleString('en-IN');
    if (kgEl) kgEl.textContent = `${Number(impact.kgWastePrevented).toLocaleString('en-IN')} kg`;
    if (co2El) co2El.textContent = `${Number(impact.co2MitigatedKg).toLocaleString('en-IN')} kg`;
    if (moneyEl) moneyEl.textContent = formatCurrency(impact.moneySavedRupees);
    if (heroMeals) heroMeals.textContent = `${Number(impact.mealsRescued).toLocaleString('en-IN')}+`;
  }

  function renderImpactPage() {
    renderGlobalImpactStats();
    const impact = Store.getImpact();

    document.getElementById('impact-page-kg').innerHTML = `${Number(impact.kgWastePrevented).toLocaleString('en-IN')} <small>kg</small>`;
    document.getElementById('impact-page-co2').innerHTML = `${Number(impact.co2MitigatedKg).toLocaleString('en-IN')} <small>kg CO₂e</small>`;
    document.getElementById('impact-page-money').textContent = formatCurrency(impact.moneySavedRupees);

    // Interactive footprint calculator
    const calcInput = document.getElementById('calc-meals-input');
    const resKg = document.getElementById('calc-res-kg');
    const resCo2 = document.getElementById('calc-res-co2');
    const resSavings = document.getElementById('calc-res-savings');
    const resTrees = document.getElementById('calc-res-trees');

    const updateCalculator = () => {
      const perWeek = Number(calcInput.value) || 1;
      const yearlyMeals = perWeek * 52;
      const kgSaved = (yearlyMeals * 0.6).toFixed(1);
      const co2Saved = Math.round(yearlyMeals * 1.5);
      const moneySaved = yearlyMeals * 150;
      const trees = Math.round(co2Saved / 21); // 1 mature tree absorbs ~21 kg CO2/year

      resKg.textContent = `${kgSaved} kg`;
      resCo2.textContent = `${co2Saved} kg`;
      resSavings.textContent = formatCurrency(moneySaved);
      resTrees.textContent = `${trees} trees`;
    };

    calcInput.addEventListener('input', updateCalculator);
    updateCalculator();

    // Render leaderboard
    const list = document.getElementById('eco-leaderboard-list');
    list.innerHTML = [
      { name: 'The Green Bistro', rescued: '840 kg', co2: '2.1 Tons CO₂', badge: '🥇 1st' },
      { name: 'Sunrise Artisan Bakery', rescued: '610 kg', co2: '1.5 Tons CO₂', badge: '🥈 2nd' },
      { name: 'Spice Route Kitchen', rescued: '490 kg', co2: '1.2 Tons CO₂', badge: '🥉 3rd' },
      { name: 'Urban Fresh Cafe', rescued: '380 kg', co2: '0.9 Tons CO₂', badge: '🌱 Top Healthy' }
    ].map(item => `
      <div class="leaderboard-item">
        <span class="leaderboard-rank">${item.badge}</span>
        <div class="leaderboard-info">
          <strong>${item.name}</strong>
          <span>Rescued: ${item.rescued} • Offset: ${item.co2}</span>
        </div>
        <span class="leaderboard-score">Zero-Waste Verified</span>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 15. DOM LISTENERS & APPLICATION BOOTSTRAP
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Top Bar Quick Actions
    document.getElementById('btn-quick-customer')?.addEventListener('click', () => {
      handleLogin('customer@zewa.in', 'pass123');
    });

    document.getElementById('btn-quick-restaurant')?.addEventListener('click', () => {
      handleLogin('greenbistro@zewa.in', 'pass123');
    });

    document.getElementById('btn-quick-organization')?.addEventListener('click', () => {
      handleLogin('ngo@zewa.in', 'pass123');
    });

    document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => {
      confirmAction('Reset Marketplace Data', 'This will restore all sample food listings, orders, and partner accounts to their initial state.', () => {
        Store.init(true);
        AppState.currentUser = null;
        updateAuthUI();
        showToast('Marketplace data successfully restored to default state!', 'success');
        window.location.hash = 'home';
        navigateTo('home');
      });
    });

    document.getElementById('btn-close-demo-bar')?.addEventListener('click', () => {
      document.getElementById('demo-top-bar').style.display = 'none';
    });

    // Navigation & Routing Link Clicks
    document.querySelectorAll('[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        window.location.hash = view;
      });
    });

    // Mobile Hamburger Menu & Backdrop
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-navigation');
    const mobileBackdrop = document.getElementById('mobile-nav-backdrop');

    const toggleMobileMenu = (forceClose = false) => {
      if (forceClose) {
        mainNav?.classList.remove('mobile-open');
        mobileMenuToggle?.classList.remove('active');
        mobileBackdrop?.classList.remove('active');
      } else {
        const isOpen = mainNav?.classList.toggle('mobile-open');
        mobileMenuToggle?.classList.toggle('active', isOpen);
        mobileBackdrop?.classList.toggle('active', isOpen);
      }
    };

    mobileMenuToggle?.addEventListener('click', () => toggleMobileMenu());
    mobileBackdrop?.addEventListener('click', () => toggleMobileMenu(true));

    // Mobile Filter Drawer Toggle in Marketplace
    const mobileFilterBtn = document.getElementById('btn-toggle-filters-mobile');
    const filterDrawer = document.querySelector('.filter-controls-drawer');
    const filterCaret = document.getElementById('filter-toggle-caret');

    mobileFilterBtn?.addEventListener('click', () => {
      const isOpen = filterDrawer?.classList.toggle('mobile-open');
      mobileFilterBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (filterCaret) {
        filterCaret.textContent = isOpen ? '▲' : '▼';
      }
    });

    // City Selector Dropdown
    const cityBtn = document.getElementById('city-selector-btn');
    const cityDropdown = document.getElementById('city-dropdown-menu');
    cityBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      cityDropdown.classList.toggle('show');
    });

    document.querySelectorAll('.city-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.city-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const locName = opt.getAttribute('data-location');
        document.getElementById('current-location-label').textContent = locName;
        cityDropdown.classList.remove('show');
        showToast(`Pickup area changed to ${locName}`, 'info');
      });
    });

    // User Avatar Menu Dropdown
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const userDropdown = document.getElementById('user-dropdown-menu');
    userAvatarBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });

    // Close open dropdowns on click outside
    document.addEventListener('click', () => {
      cityDropdown?.classList.remove('show');
      userDropdown?.classList.remove('show');
    });

    // Sell / Donate Navigation Link
    document.getElementById('nav-link-sell-donate')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (AppState.currentUser && (AppState.currentUser.role === 'restaurant' || AppState.currentUser.role === 'seller')) {
        window.location.hash = 'restaurant-dashboard';
        document.querySelector('[data-rest-tab="add-new-listing"]')?.click();
      } else {
        openModal('modal-auth');
        document.getElementById('tab-register-btn').click();
        document.getElementById('role-label-restaurant').click();
      }
    });

    // Hero Section CTAs
    document.getElementById('hero-btn-explore')?.addEventListener('click', () => {
      window.location.hash = 'marketplace';
    });

    document.getElementById('hero-btn-sell')?.addEventListener('click', () => {
      if (AppState.currentUser && (AppState.currentUser.role === 'restaurant' || AppState.currentUser.role === 'seller')) {
        window.location.hash = 'restaurant-dashboard';
        document.querySelector('[data-rest-tab="add-new-listing"]')?.click();
      } else {
        openModal('modal-auth');
        document.getElementById('tab-register-btn').click();
        document.getElementById('role-label-restaurant').click();
      }
    });

    document.getElementById('hero-btn-donate')?.addEventListener('click', () => {
      if (AppState.currentUser && (AppState.currentUser.role === 'restaurant' || AppState.currentUser.role === 'seller')) {
        window.location.hash = 'restaurant-dashboard';
        document.querySelector('[data-rest-tab="add-new-listing"]')?.click();
        const donateRadio = document.querySelector('input[name="new-listing-type"][value="donate"]');
        if (donateRadio) {
          donateRadio.checked = true;
          donateRadio.dispatchEvent(new Event('change'));
        }
      } else if (AppState.currentUser && AppState.currentUser.role === 'organization') {
        window.location.hash = 'organization-dashboard';
      } else {
        openModal('modal-auth');
        document.getElementById('tab-register-btn').click();
        document.getElementById('role-label-organization').click();
      }
    });

    document.getElementById('hero-btn-partner')?.addEventListener('click', () => {
      if (AppState.currentUser && (AppState.currentUser.role === 'restaurant' || AppState.currentUser.role === 'seller')) {
        window.location.hash = 'restaurant-dashboard';
      } else {
        openModal('modal-auth');
        document.getElementById('tab-register-btn').click();
        document.getElementById('role-label-restaurant').click();
      }
    });

    document.getElementById('hero-card-reserve-btn')?.addEventListener('click', () => {
      initiateReservation('food-1');
    });

    document.getElementById('btn-see-all-food')?.addEventListener('click', () => {
      window.location.hash = 'marketplace';
    });

    // Featured Food Type Tab Filters (All vs Discounted vs Free Donated)
    document.querySelectorAll('.featured-tab-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.featured-tab-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filterType = pill.getAttribute('data-featured-type') || pill.getAttribute('data-type') || 'all';
        renderFeaturedFood(filterType);
      });
    });

    // Benefits Section CTAs
    document.getElementById('btn-benefit-customer-cta')?.addEventListener('click', () => {
      window.location.hash = 'marketplace';
    });

    document.getElementById('btn-benefit-partner-cta')?.addEventListener('click', () => {
      openModal('modal-auth');
      document.getElementById('tab-register-btn').click();
      document.getElementById('role-label-restaurant').click();
    });

    // How It Works Tabs (Customer vs Food Seller vs Organization)
    document.querySelectorAll('.how-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.how-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const flow = btn.getAttribute('data-flow');
        ['customer', 'restaurant', 'organization'].forEach(f => {
          const el = document.getElementById(`flow-${f}`);
          if (el) el.classList.toggle('hidden', f !== flow);
        });
      });
    });

    // Auth Buttons & Modals
    document.getElementById('btn-open-login')?.addEventListener('click', () => {
      openModal('modal-auth');
      document.getElementById('tab-login-btn').click();
    });

    document.getElementById('btn-open-register')?.addEventListener('click', () => {
      openModal('modal-auth');
      document.getElementById('tab-register-btn').click();
    });

    document.getElementById('modal-auth-close')?.addEventListener('click', () => closeModal('modal-auth'));
    document.getElementById('modal-food-close')?.addEventListener('click', () => closeModal('modal-food-details'));
    document.getElementById('modal-checkout-close')?.addEventListener('click', () => closeModal('modal-checkout'));
    document.getElementById('modal-confirmation-close')?.addEventListener('click', () => closeModal('modal-confirmation'));
    document.getElementById('modal-edit-listing-close')?.addEventListener('click', () => closeModal('modal-edit-listing'));
    document.getElementById('btn-cancel-edit-listing')?.addEventListener('click', () => closeModal('modal-edit-listing'));

    // Auth 1-Click Demo Buttons inside Modal
    document.getElementById('demo-auth-customer')?.addEventListener('click', () => {
      handleLogin('customer@zewa.in', 'pass123');
    });

    document.getElementById('demo-auth-restaurant')?.addEventListener('click', () => {
      handleLogin('greenbistro@zewa.in', 'pass123');
    });

    document.getElementById('demo-auth-organization')?.addEventListener('click', () => {
      handleLogin('ngo@zewa.in', 'pass123');
    });

    // Auth Tabs Switch: Login vs Register
    const tabLogin = document.getElementById('tab-login-btn');
    const tabRegister = document.getElementById('tab-register-btn');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    tabLogin?.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.classList.remove('hidden');
      formRegister.classList.add('hidden');
    });

    tabRegister?.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.classList.remove('hidden');
      formLogin.classList.add('hidden');
    });

    // Auth Role Radio Toggle
    const roleCust = document.getElementById('role-label-customer');
    const roleRest = document.getElementById('role-label-restaurant');
    const roleOrg = document.getElementById('role-label-organization');
    const regAddressGroup = document.getElementById('reg-restaurant-address-group');
    const regOrgGroup = document.getElementById('reg-org-type-group');
    const regNameLabel = document.getElementById('reg-name-label');

    roleCust?.addEventListener('click', () => {
      roleCust.classList.add('active');
      roleRest?.classList.remove('active');
      roleOrg?.classList.remove('active');
      regAddressGroup?.classList.add('hidden');
      regOrgGroup?.classList.add('hidden');
      if (regNameLabel) regNameLabel.textContent = 'Full Name *';
      const emailInput = document.getElementById('login-email');
      if (emailInput) emailInput.placeholder = 'e.g. customer@zewa.in';
    });

    roleRest?.addEventListener('click', () => {
      roleRest.classList.add('active');
      roleCust?.classList.remove('active');
      roleOrg?.classList.remove('active');
      regAddressGroup?.classList.remove('hidden');
      regOrgGroup?.classList.add('hidden');
      if (regNameLabel) regNameLabel.textContent = 'Restaurant / Shop / Seller Name *';
      const emailInput = document.getElementById('login-email');
      if (emailInput) emailInput.placeholder = 'e.g. greenbistro@zewa.in';
    });

    roleOrg?.addEventListener('click', () => {
      roleOrg.classList.add('active');
      roleCust?.classList.remove('active');
      roleRest?.classList.remove('active');
      regAddressGroup?.classList.add('hidden');
      regOrgGroup?.classList.remove('hidden');
      if (regNameLabel) regNameLabel.textContent = 'Organization Name (Hostel / Ashram / NGO) *';
      const emailInput = document.getElementById('login-email');
      if (emailInput) emailInput.placeholder = 'e.g. ngo@zewa.in';
    });

    // Password Visibility Toggles
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
          btn.textContent = input.type === 'password' ? '👁️' : '🙈';
        }
      });
    });

    // Submit Login
    formLogin?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const remember = document.getElementById('login-remember').checked;
      handleLogin(email, pass, remember);
    });

    // Submit Registration
    formRegister?.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.querySelector('input[name="auth-role"]:checked').value;
      const data = {
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        password: document.getElementById('reg-password').value,
        role: role,
        address: document.getElementById('reg-address').value.trim(),
        orgType: document.getElementById('reg-org-type')?.value || 'Student Hostel'
      };
      handleRegister(data);
    });

    // User Dropdown Actions
    document.getElementById('btn-nav-orders')?.addEventListener('click', () => {
      window.location.hash = 'customer-dashboard';
    });

    document.getElementById('dropdown-btn-customer-dash')?.addEventListener('click', () => {
      window.location.hash = 'customer-dashboard';
    });

    document.getElementById('dropdown-btn-my-orders')?.addEventListener('click', () => {
      window.location.hash = 'customer-dashboard';
      document.querySelector('[data-cust-tab="active-orders"]')?.click();
    });

    document.getElementById('dropdown-btn-seller-dash')?.addEventListener('click', () => {
      window.location.hash = 'restaurant-dashboard';
    });

    document.getElementById('dropdown-btn-restaurant-dash')?.addEventListener('click', () => {
      window.location.hash = 'restaurant-dashboard';
    });

    document.getElementById('dropdown-btn-add-listing')?.addEventListener('click', () => {
      window.location.hash = 'restaurant-dashboard';
      document.querySelector('[data-rest-tab="add-new-listing"]')?.click();
    });

    document.getElementById('dropdown-btn-verify-pickup')?.addEventListener('click', () => {
      window.location.hash = 'restaurant-dashboard';
      document.getElementById('verify-code-input')?.focus();
    });

    document.getElementById('dropdown-btn-org-dash')?.addEventListener('click', () => {
      window.location.hash = 'organization-dashboard';
    });

    document.getElementById('dropdown-btn-org-donations')?.addEventListener('click', () => {
      window.location.hash = 'organization-dashboard';
      document.querySelector('[data-org-tab="available-donations"]')?.click();
    });

    document.getElementById('dropdown-btn-org-requests')?.addEventListener('click', () => {
      window.location.hash = 'organization-dashboard';
      document.querySelector('[data-org-tab="claimed-requests"]')?.click();
    });

    document.getElementById('dropdown-btn-edit-profile')?.addEventListener('click', () => {
      if (AppState.currentUser?.role === 'organization') {
        window.location.hash = 'organization-dashboard';
        document.querySelector('[data-org-tab="org-profile"]')?.click();
      } else if (AppState.currentUser?.role === 'restaurant' || AppState.currentUser?.role === 'seller') {
        window.location.hash = 'restaurant-dashboard';
        document.querySelector('[data-rest-tab="restaurant-profile"]')?.click();
      } else {
        window.location.hash = 'customer-dashboard';
        document.querySelector('[data-cust-tab="profile-settings"]')?.click();
      }
    });

    document.getElementById('dropdown-btn-logout')?.addEventListener('click', handleLogout);

    // Footer quick demo links
    document.getElementById('footer-btn-demo-cust')?.addEventListener('click', () => {
      handleLogin('customer@zewa.in', 'pass123');
    });

    document.getElementById('footer-btn-demo-rest')?.addEventListener('click', () => {
      handleLogin('greenbistro@zewa.in', 'pass123');
    });

    document.getElementById('footer-btn-reset')?.addEventListener('click', () => {
      document.getElementById('btn-reset-demo-data')?.click();
    });

    // Marketplace Search & Filters
    const searchInput = document.getElementById('marketplace-search-input');
    const locationInput = document.getElementById('marketplace-location-input');
    const clearSearchBtn = document.getElementById('btn-clear-search');

    searchInput?.addEventListener('input', (e) => {
      AppState.activeFilter.search = e.target.value;
      clearSearchBtn?.classList.toggle('hidden', !e.target.value);
      renderMarketplace();
    });

    locationInput?.addEventListener('input', (e) => {
      AppState.activeFilter.location = e.target.value;
      renderMarketplace();
    });

    clearSearchBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      AppState.activeFilter.search = '';
      clearSearchBtn.classList.add('hidden');
      renderMarketplace();
    });

    document.getElementById('sort-by-select')?.addEventListener('change', (e) => {
      AppState.activeFilter.sortBy = e.target.value;
      renderMarketplace();
    });

    // Marketplace Type Filter Pills (All vs Discounted Sell vs 100% Free Donated)
    document.querySelectorAll('.mkt-type-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.mkt-type-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        AppState.activeFilter.type = pill.getAttribute('data-mkt-type') || pill.getAttribute('data-type') || 'all';
        renderMarketplace();
      });
    });

    // Category pills (scoped strictly to #category-pills-bar)
    document.querySelectorAll('#category-pills-bar .category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#category-pills-bar .category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        AppState.activeFilter.category = pill.getAttribute('data-category') || 'all';
        renderMarketplace();
      });
    });

    // Dietary toggle
    document.querySelectorAll('.dietary-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dietary-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.activeFilter.diet = btn.getAttribute('data-diet');
        renderMarketplace();
      });
    });

    // Price slider
    const priceSlider = document.getElementById('price-range-slider');
    const priceLabel = document.getElementById('price-slider-label');
    priceSlider?.addEventListener('input', (e) => {
      AppState.activeFilter.maxPrice = Number(e.target.value);
      if (priceLabel) priceLabel.textContent = formatCurrency(e.target.value);
      renderMarketplace();
    });

    // Distance slider
    const distSlider = document.getElementById('distance-range-slider');
    const distLabel = document.getElementById('distance-slider-label');
    distSlider?.addEventListener('input', (e) => {
      AppState.activeFilter.maxDistance = Number(e.target.value);
      if (distLabel) distLabel.textContent = `${e.target.value} km`;
      renderMarketplace();
    });

    // Reset filters
    const resetFiltersHandler = () => {
      AppState.activeFilter = {
        search: '',
        location: '',
        type: 'all',
        category: 'all',
        diet: 'all',
        maxPrice: 600,
        maxDistance: 15,
        sortBy: 'discount-desc'
      };
      if (searchInput) searchInput.value = '';
      if (locationInput) locationInput.value = '';
      clearSearchBtn?.classList.add('hidden');
      document.querySelectorAll('.mkt-type-pill').forEach(p => p.classList.toggle('active', (p.getAttribute('data-mkt-type') || p.getAttribute('data-type')) === 'all'));
      document.querySelectorAll('#category-pills-bar .category-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      document.querySelectorAll('.dietary-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-diet') === 'all'));
      if (priceSlider) { priceSlider.value = 600; if (priceLabel) priceLabel.textContent = '₹600'; }
      if (distSlider) { distSlider.value = 15; if (distLabel) distLabel.textContent = '15 km'; }
      const sortSelect = document.getElementById('sort-by-select');
      if (sortSelect) sortSelect.value = 'discount-desc';
      renderMarketplace();
    };

    document.getElementById('btn-reset-filters')?.addEventListener('click', resetFiltersHandler);
    document.getElementById('btn-empty-reset')?.addEventListener('click', resetFiltersHandler);

    // Customer Dashboard Tab switching
    document.querySelectorAll('[data-cust-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-cust-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-cust-tab');
        document.querySelectorAll('.dashboard-layout .dash-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`cust-tab-${target}`)?.classList.add('active');
      });
    });

    // Customer Profile Edit Form
    document.getElementById('form-customer-profile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = AppState.currentUser;
      if (!user) return;

      user.name = document.getElementById('cust-prof-name').value.trim();
      user.phone = document.getElementById('cust-prof-phone').value.trim();
      user.email = document.getElementById('cust-prof-email').value.trim();
      user.city = document.getElementById('cust-prof-city').value.trim();
      user.avatar = document.getElementById('cust-prof-avatar-url').value;

      Store.setUser(user);

      const users = Store.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        Store.saveUsers(users);
      }

      updateAuthUI();
      renderCustomerDashboard();
      showToast('Profile information saved successfully!', 'success');
    });

    // Customer Avatar Preset Selection
    document.querySelectorAll('.avatar-preset').forEach(preset => {
      preset.addEventListener('click', () => {
        document.querySelectorAll('.avatar-preset').forEach(p => p.classList.remove('active'));
        preset.classList.add('active');
        document.getElementById('cust-prof-avatar-url').value = preset.src;
      });
    });

    // Restaurant Dashboard Tab switching
    document.querySelectorAll('[data-rest-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-rest-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-rest-tab');
        document.querySelectorAll('#view-restaurant-dashboard .dash-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`rest-tab-${target}`)?.classList.add('active');
      });
    });

    // Restaurant Counter Tool: Pickup Verification Form
    document.getElementById('form-verify-pickup-code')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('verify-code-input').value;
      handleVerifyPickupCode(code);
    });

    // Restaurant Profile Edit Form
    document.getElementById('form-restaurant-profile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = AppState.currentUser;
      if (!user || (user.role !== 'restaurant' && user.role !== 'seller')) return;

      const restName = document.getElementById('rest-prof-name').value.trim();
      user.restaurantName = restName;
      user.sellerName = restName;
      user.owner = document.getElementById('rest-prof-owner').value.trim();
      user.phone = document.getElementById('rest-prof-phone').value.trim();
      user.email = document.getElementById('rest-prof-email').value.trim();
      user.address = document.getElementById('rest-prof-address').value.trim();
      user.cuisines = document.getElementById('rest-prof-cuisine').value.trim();
      if (document.getElementById('rest-prof-image').value.trim()) {
        user.avatar = document.getElementById('rest-prof-image').value.trim();
      }

      Store.setUser(user);

      const users = Store.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        Store.saveUsers(users);
      }

      updateAuthUI();
      renderRestaurantDashboard();
      showToast('Food seller details updated successfully!', 'success');
    });

    // Organization Dashboard Tab switching
    document.querySelectorAll('[data-org-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-org-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-org-tab');
        document.querySelectorAll('#view-organization-dashboard .dash-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`org-tab-${target}`)?.classList.add('active');
      });
    });

    // Organization Banner Explore CTA
    document.getElementById('btn-org-browse-donations')?.addEventListener('click', () => {
      document.querySelector('[data-org-tab="available-donations"]')?.click();
    });

    // Organization Profile Edit Form
    document.getElementById('form-org-profile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = AppState.currentUser;
      if (!user || user.role !== 'organization') return;

      user.orgName = document.getElementById('org-prof-name').value.trim();
      user.name = user.orgName;
      user.orgType = document.getElementById('org-prof-type').value;
      user.representative = document.getElementById('org-prof-rep').value.trim();
      user.phone = document.getElementById('org-prof-phone').value.trim();
      user.email = document.getElementById('org-prof-email').value.trim();
      user.address = document.getElementById('org-prof-address').value.trim();

      Store.setUser(user);

      const users = Store.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        Store.saveUsers(users);
      }

      updateAuthUI();
      renderOrganizationDashboard();
      showToast('Organization details updated successfully!', 'success');
    });

    // Edit Listing Form Submission
    document.getElementById('form-edit-listing')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-food-id').value;
      const listings = Store.getListings();
      const item = listings.find(l => l.id === id);

      if (item) {
        item.title = document.getElementById('edit-food-title').value.trim();
        item.originalPrice = Number(document.getElementById('edit-food-orig-price').value);
        item.discountedPrice = Number(document.getElementById('edit-food-disc-price').value);
        item.discountPercent = Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100);
        item.quantity = Number(document.getElementById('edit-food-quantity').value);
        item.status = document.getElementById('edit-food-status').value;
        item.pickupStart = document.getElementById('edit-food-pickup-start').value;
        item.pickupEnd = document.getElementById('edit-food-pickup-end').value;

        Store.saveListings(listings);
        closeModal('modal-edit-listing');
        showToast(`Listing "${item.title}" updated successfully!`, 'success');

        renderRestaurantDashboard();
        renderMarketplace();
        renderFeaturedFood();
      }
    });

    // Quick Action button in restaurant banner
    document.getElementById('btn-quick-add-listing')?.addEventListener('click', () => {
      document.querySelector('[data-rest-tab="add-new-listing"]').click();
    });

    // Customer Explore button in customer banner
    document.getElementById('btn-customer-explore-more')?.addEventListener('click', () => {
      window.location.hash = 'marketplace';
    });

    // Setup Add Listing Form
    setupAddListingForm();

    // Initial UI Setup
    updateAuthUI();
    const initialHash = window.location.hash.replace('#', '') || 'home';
    navigateTo(initialHash);
  });

})();
