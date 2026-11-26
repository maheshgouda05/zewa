/**
 * ============================================================================
 * ZEWA (Zero Waste) - Surplus Food Marketplace Prototype
 * Complete Frontend Application Logic & LocalStorage State Management
 * Second-Year Engineering Mini Project
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

  // Demo Restaurant Partners
  const DEFAULT_RESTAURANTS = [
    {
      id: 'rest-1',
      name: 'The Green Bistro',
      owner: 'Chef Priya Patel',
      phone: '+91 98123 45678',
      email: 'greenbistro@zewa.demo',
      address: '12th Main, 100ft Road, Indiranagar, Bengaluru',
      cuisines: 'Continental, Healthy Bowls, European',
      rating: 4.8,
      distance: 1.1,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 380, y: 220 } // Coordinates on our SVG map
    },
    {
      id: 'rest-2',
      name: 'Sunrise Artisan Bakery',
      owner: 'Marco D’Souza',
      phone: '+91 98234 56789',
      email: 'sunrise@zewa.demo',
      address: 'CMH Road, Near Metro Station, Indiranagar, Bengaluru',
      cuisines: 'Bakery, French Patisserie, Coffee',
      rating: 4.9,
      distance: 0.8,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 260, y: 290 }
    },
    {
      id: 'rest-3',
      name: 'Spice Route Kitchen',
      owner: 'Kavita Nair',
      phone: '+91 98345 67890',
      email: 'spiceroute@zewa.demo',
      address: 'Defence Colony, Indiranagar, Bengaluru',
      cuisines: 'North Indian, Mughlai, Biryani',
      rating: 4.7,
      distance: 1.6,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 700, y: 390 }
    },
    {
      id: 'rest-4',
      name: 'Urban Fresh Cafe & Salads',
      owner: 'Aditya Roy',
      phone: '+91 98456 78901',
      email: 'urbanfresh@zewa.demo',
      address: '100ft Road, Opposite Toit, Indiranagar, Bengaluru',
      cuisines: 'Organic Salads, Cold Pressed Juices, Wraps',
      rating: 4.8,
      distance: 1.3,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 440, y: 380 }
    },
    {
      id: 'rest-5',
      name: 'Sweet Treat Delights',
      owner: 'Farhan Akhtar',
      phone: '+91 98567 89012',
      email: 'sweettreat@zewa.demo',
      address: 'HAL 2nd Stage, Indiranagar, Bengaluru',
      cuisines: 'Pastries, Belgian Chocolates, Desserts',
      rating: 4.9,
      distance: 2.2,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 620, y: 190 }
    },
    {
      id: 'rest-6',
      name: 'Dakshin Delicacy',
      owner: 'Ramanathan Iyer',
      phone: '+91 98678 90123',
      email: 'dakshin@zewa.demo',
      address: 'Double Road, Indiranagar, Bengaluru',
      cuisines: 'South Indian, Traditional Meals, Filter Coffee',
      rating: 4.6,
      distance: 1.8,
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      mapCoords: { x: 180, y: 460 }
    }
  ];

  // Demo Accounts: 1 Customer & 1 Restaurant ready for immediate 1-click test
  const DEFAULT_USERS = [
    {
      id: 'user-cust-1',
      name: 'Aarav Sharma',
      email: 'customer@zewa.demo',
      password: 'pass123',
      role: 'customer',
      phone: '+91 98765 43210',
      city: 'Indiranagar, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      savedKg: 8.4,
      savedMoney: 2150
    },
    {
      id: 'user-rest-1',
      name: 'Chef Priya Patel',
      restaurantName: 'The Green Bistro',
      restaurantId: 'rest-1',
      email: 'greenbistro@zewa.demo',
      password: 'pass123',
      role: 'restaurant',
      phone: '+91 98123 45678',
      city: 'Indiranagar, Bengaluru',
      address: '12th Main, 100ft Road, Indiranagar, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=160&q=80'
    }
  ];

  // 10+ Diverse Realistic Surplus Food Listings
  const DEFAULT_LISTINGS = [
    {
      id: 'food-1',
      title: 'Artisan Sourdough & Patisserie Mystery Bag',
      restaurantId: 'rest-2',
      restaurantName: 'Sunrise Artisan Bakery',
      category: 'Bakery',
      diet: 'veg',
      originalPrice: 450,
      discountedPrice: 159,
      discountPercent: 65,
      quantity: 4,
      pickupStart: '19:30',
      pickupEnd: '21:30',
      distance: 0.8,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      description: 'A surprise bundle of freshly baked country sourdough loaf, 2 butter croissants, and Danish fruit pastries baked fresh this morning. Perfectly safe and delicious!',
      ingredients: 'Organic wheat flour, French cultured butter, sourdough starter, sea salt, yeast.',
      expiryNote: 'Safe to consume within 48 hours. Best toasted!'
    },
    {
      id: 'food-2',
      title: 'Gourmet Paneer Tikka & Herb Rice Platter',
      restaurantId: 'rest-3',
      restaurantName: 'Spice Route Kitchen',
      category: 'Meals',
      diet: 'veg',
      originalPrice: 380,
      discountedPrice: 149,
      discountPercent: 61,
      quantity: 3,
      pickupStart: '20:00',
      pickupEnd: '22:00',
      distance: 1.6,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      description: 'Charcoal-grilled cottage cheese cubes marinated in Kashmiri spice yogurt, served alongside fragrant jeera basmati rice, mint chutney, and butter roti.',
      ingredients: 'Fresh paneer, spiced curd, basmati rice, cumin, green mint, whole wheat roti.',
      expiryNote: 'Prepared during evening service. Refrigerate upon pickup.'
    },
    {
      id: 'food-3',
      title: 'Mediterranean Quinoa & Avocado Superfood Bowl',
      restaurantId: 'rest-4',
      restaurantName: 'Urban Fresh Cafe & Salads',
      category: 'Healthy',
      diet: 'veg',
      originalPrice: 340,
      discountedPrice: 129,
      discountPercent: 62,
      quantity: 5,
      pickupStart: '18:45',
      pickupEnd: '21:00',
      distance: 1.3,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      description: 'Organic rainbow salad with fluffy Peruvian quinoa, Hass avocado, cherry tomatoes, cucumbers, kalamata olives, feta cheese, and citrus lemon-herb dressing.',
      ingredients: 'Tri-color quinoa, Hass avocado, greens, kalamata olives, Danish feta, lemon vinaigrette.',
      expiryNote: 'Assembled cold. Consume within 24 hours.'
    },
    {
      id: 'food-4',
      title: 'Butter Chicken & Garlic Naan Feast Box',
      restaurantId: 'rest-1',
      restaurantName: 'The Green Bistro',
      category: 'Meals',
      diet: 'non-veg',
      originalPrice: 480,
      discountedPrice: 189,
      discountPercent: 61,
      quantity: 2,
      pickupStart: '20:30',
      pickupEnd: '22:30',
      distance: 1.1,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      description: 'Succulent tandoori chicken cooked in rich, slow-simmered tomato makhani gravy with fresh cream. Includes 2 garlic butter naans and pickled onions.',
      ingredients: 'Tender chicken breast, San Marzano tomatoes, cashew paste, fresh cream, butter naans.',
      expiryNote: 'Hot kitchen prep. Reheat thoroughly before eating.'
    },
    {
      id: 'food-5',
      title: 'Belgian Dark Chocolate Truffle & Mousse Pack',
      restaurantId: 'rest-5',
      restaurantName: 'Sweet Treat Delights',
      category: 'Desserts',
      diet: 'veg',
      originalPrice: 400,
      discountedPrice: 140,
      discountPercent: 65,
      quantity: 4,
      pickupStart: '19:00',
      pickupEnd: '22:00',
      distance: 2.2,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      description: 'Indulgent box of 2 Belgian 70% dark chocolate mousse jars and 4 handcrafted hazelnut ganache truffles made by our master chocolatier.',
      ingredients: 'Cacao Barry 70% chocolate, dairy cream, roasted hazelnuts, organic raw sugar.',
      expiryNote: 'Keep chilled. Shelf life: 3 days.'
    },
    {
      id: 'food-6',
      title: 'South Indian Royal Thali Surplus Box',
      restaurantId: 'rest-6',
      restaurantName: 'Dakshin Delicacy',
      category: 'Meals',
      diet: 'veg',
      originalPrice: 260,
      discountedPrice: 89,
      discountPercent: 66,
      quantity: 6,
      pickupStart: '15:00',
      pickupEnd: '17:00',
      distance: 1.8,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
      description: 'Traditional lunchtime surplus: Sona Masoori boiled rice, drumstick sambar, rasam, avial, poriyal, curd, and crunchy roasted papad.',
      ingredients: 'Lentils, seasonal country vegetables, coconut, curry leaves, tamarind, rice.',
      expiryNote: 'Fresh lunch batch. Eat warm.'
    },
    {
      id: 'food-7',
      title: 'Woodfired Margherita Pizza & Herb Focaccia',
      restaurantId: 'rest-1',
      restaurantName: 'The Green Bistro',
      category: 'Meals',
      diet: 'veg',
      originalPrice: 520,
      discountedPrice: 199,
      discountPercent: 62,
      quantity: 3,
      pickupStart: '20:15',
      pickupEnd: '22:00',
      distance: 1.1,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      description: 'One 11-inch classic Neapolitan pizza with San Marzano sauce, fresh mozzarella balls, basil, and a slice of rosemary olive oil focaccia.',
      ingredients: 'Caputo 00 flour, Italian whole peeled tomatoes, fior di latte mozzarella, basil.',
      expiryNote: 'Baked in woodfire stone oven today.'
    },
    {
      id: 'food-8',
      title: 'Crispy Falafel, Hummus & Pita Mezze Box',
      restaurantId: 'rest-3',
      restaurantName: 'Spice Route Kitchen',
      category: 'Snacks',
      diet: 'veg',
      originalPrice: 320,
      discountedPrice: 119,
      discountPercent: 63,
      quantity: 4,
      pickupStart: '18:00',
      pickupEnd: '21:30',
      distance: 1.6,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
      description: '6 spiced herb falafels served with velvety tahini hummus, pickled turnip ribbons, spicy zhoug sauce, and 2 warm wholewheat pita pockets.',
      ingredients: 'Chickpeas, fresh coriander, parsley, sesame tahini, olive oil, garlic.',
      expiryNote: 'Best consumed within 24 hours.'
    },
    {
      id: 'food-9',
      title: 'Farm Fresh Organic Fruit & Berries Crate',
      restaurantId: 'rest-4',
      restaurantName: 'Urban Fresh Cafe & Salads',
      category: 'Fresh Produce',
      diet: 'veg',
      originalPrice: 350,
      discountedPrice: 129,
      discountPercent: 63,
      quantity: 3,
      pickupStart: '17:00',
      pickupEnd: '20:30',
      distance: 1.3,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      description: 'A box of ripe, sweet organic fruits from local Karnataka farms: strawberries, dragonfruit, bananas, apples, and pomegranate pearls ready for smoothies.',
      ingredients: '100% natural organic whole fruits, washed and ready to slice.',
      expiryNote: 'Naturally ripe. Perfect for juices or breakfast.'
    },
    {
      id: 'food-10',
      title: 'Fluffy Golden Blueberry Pancakes Stack',
      restaurantId: 'rest-2',
      restaurantName: 'Sunrise Artisan Bakery',
      category: 'Bakery',
      diet: 'veg',
      originalPrice: 300,
      discountedPrice: 109,
      discountPercent: 64,
      quantity: 2,
      pickupStart: '17:30',
      pickupEnd: '19:30',
      distance: 0.8,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      description: 'Stack of 4 buttermilk pancakes folded with wild blueberries, accompanied by pure maple syrup and whipped honey butter.',
      ingredients: 'Wheat flour, cultured buttermilk, farm eggs, wild blueberries, maple syrup.',
      expiryNote: 'Evening brunch prep. Warm in oven or microwave for 30s.'
    }
  ];

  // Demo Orders for immediate verification demonstration
  const DEFAULT_ORDERS = [
    {
      id: 'ZW-2026-9041',
      pickupCode: 'ZEWA-8492',
      foodId: 'food-1',
      foodTitle: 'Artisan Sourdough & Patisserie Mystery Bag',
      foodImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      restaurantId: 'rest-1',
      restaurantName: 'The Green Bistro',
      restaurantAddress: '12th Main, 100ft Road, Indiranagar',
      customerName: 'Aarav Sharma',
      customerEmail: 'customer@zewa.demo',
      customerPhone: '+91 98765 43210',
      quantity: 1,
      unitPrice: 159,
      totalPrice: 159,
      moneySaved: 291,
      wasteSavedKg: 0.8,
      paymentMethod: 'UPI (GPay)',
      pickupStart: '19:30',
      pickupEnd: '21:30',
      createdAt: '2026-11-26T14:15:00.000Z',
      status: 'ready_for_pickup' // ready_for_pickup | collected | cancelled
    },
    {
      id: 'ZW-2026-8832',
      pickupCode: 'ZEWA-3174',
      foodId: 'food-4',
      foodTitle: 'Butter Chicken & Garlic Naan Feast Box',
      foodImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
      restaurantId: 'rest-1',
      restaurantName: 'The Green Bistro',
      restaurantAddress: '12th Main, 100ft Road, Indiranagar',
      customerName: 'Aarav Sharma',
      customerEmail: 'customer@zewa.demo',
      customerPhone: '+91 98765 43210',
      quantity: 2,
      unitPrice: 189,
      totalPrice: 378,
      moneySaved: 582,
      wasteSavedKg: 1.4,
      paymentMethod: 'Credit Card',
      pickupStart: '20:30',
      pickupEnd: '22:30',
      createdAt: '2026-11-25T18:00:00.000Z',
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
      if (forceReset || !localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
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
      category: 'all',
      diet: 'all',
      maxPrice: 600,
      maxDistance: 15,
      sortBy: 'discount-desc'
    },
    selectedFoodForModal: null,
    selectedFoodForCheckout: null,
    checkoutQuantity: 1,
    selectedPaymentMethod: 'UPI'
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
    // If attempting to visit a protected role dashboard without proper login, guide user
    if (viewName === 'customer-dashboard') {
      if (!AppState.currentUser) {
        showToast('Please log in as a customer first', 'info');
        openModal('modal-auth');
        return;
      }
      if (AppState.currentUser.role !== 'customer') {
        showToast('You are currently logged in as a restaurant', 'info');
        viewName = 'restaurant-dashboard';
      }
    } else if (viewName === 'restaurant-dashboard') {
      if (!AppState.currentUser) {
        showToast('Please log in as a restaurant first', 'info');
        openModal('modal-auth');
        return;
      }
      if (AppState.currentUser.role !== 'restaurant') {
        showToast('You are currently logged in as a customer', 'info');
        viewName = 'customer-dashboard';
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

    // Close mobile nav drawer if open
    document.getElementById('main-navigation').classList.remove('mobile-open');

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
    const restaurantLinks = document.getElementById('dropdown-restaurant-links');
    const activeOrdersCountEl = document.getElementById('active-orders-count');

    if (user) {
      guestActions.classList.add('hidden');
      userActions.classList.remove('hidden');

      const isRestaurant = user.role === 'restaurant';
      userRoleBadge.textContent = isRestaurant ? '🏪 Restaurant' : '👤 Customer';
      navUserName.textContent = isRestaurant ? (user.restaurantName || user.name) : user.name;
      navUserAvatar.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';

      dropdownUserName.textContent = isRestaurant ? (user.restaurantName || user.name) : user.name;
      dropdownUserEmail.textContent = user.email;
      dropdownUserRole.textContent = isRestaurant ? 'Restaurant Partner' : 'Customer Account';

      if (isRestaurant) {
        customerLinks.classList.add('hidden');
        restaurantLinks.classList.remove('hidden');
      } else {
        customerLinks.classList.remove('hidden');
        restaurantLinks.classList.add('hidden');
      }

      // Update active order pill count
      const allOrders = Store.getOrders();
      const myActiveOrders = allOrders.filter(o => 
        (user.role === 'customer' ? o.customerEmail === user.email : o.restaurantId === user.restaurantId) &&
        o.status === 'ready_for_pickup'
      );
      activeOrdersCountEl.textContent = myActiveOrders.length;
    } else {
      guestActions.classList.remove('hidden');
      userActions.classList.add('hidden');
      activeOrdersCountEl.textContent = '0';
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
      showToast('Incorrect password. Demo password is pass123', 'error');
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
    if (foundUser.role === 'restaurant') {
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
      role: data.role,
      phone: data.phone,
      city: 'Indiranagar, Bengaluru',
      avatar: data.role === 'restaurant'
        ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      savedKg: 0,
      savedMoney: 0
    };

    if (data.role === 'restaurant') {
      newUser.restaurantName = data.name;
      newUser.restaurantId = 'rest-' + Date.now();
      newUser.address = data.address || 'Bengaluru';
    }

    users.push(newUser);
    Store.saveUsers(users);

    AppState.currentUser = newUser;
    Store.setUser(newUser);
    updateAuthUI();
    closeModal('modal-auth');

    showToast(`Account created successfully! Welcome to ZEWA, ${newUser.name}.`, 'success');
    window.location.hash = data.role === 'restaurant' ? 'restaurant-dashboard' : 'customer-dashboard';
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

    return `
      <div class="food-card ${isSoldOut ? 'sold-out' : ''}" data-food-id="${item.id}">
        <div class="food-card-thumb-wrap">
          <img src="${item.image}" alt="${item.title}" class="food-card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
          <span class="food-badge-discount">${item.discountPercent}% OFF</span>
          <span class="food-badge-diet ${item.diet}">${dietIcon}</span>
          <div class="food-card-pickup-time">
            <span>🕒 Pickup: <strong>${item.pickupStart} – ${item.pickupEnd}</strong></span>
          </div>
        </div>

        <div class="food-card-body">
          <div class="food-card-meta">
            <span class="food-restaurant-name">${item.restaurantName}</span>
            <span class="food-distance">📍 ${item.distance} km</span>
          </div>

          <h3 class="food-card-title" title="${item.title}">${item.title}</h3>
          <span class="food-card-category-tag">${item.category}</span>

          <div class="food-card-stock">
            ${isSoldOut 
              ? '❌ Sold Out For Today' 
              : `📦 <strong>${item.quantity} ${item.quantity === 1 ? 'bag' : 'bags'} remaining</strong>`}
          </div>

          <div class="food-card-pricing">
            <span class="price-orig">${formatCurrency(item.originalPrice)}</span>
            <span class="price-disc">${formatCurrency(item.discountedPrice)}</span>
            <span class="price-saved">Save ${formatCurrency(item.originalPrice - item.discountedPrice)}</span>
          </div>

          <div class="food-card-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-view-details" data-id="${item.id}">
              Details
            </button>
            <button type="button" class="btn btn-primary btn-sm btn-reserve-card ${isSoldOut ? 'disabled' : ''}" data-id="${item.id}">
              ${isSoldOut ? 'Sold Out' : 'Reserve'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFeaturedFood() {
    const grid = document.getElementById('featured-food-grid');
    if (!grid) return;

    const listings = Store.getListings();
    // Pick top 4 active items with highest discount
    const topPicks = [...listings]
      .filter(i => i.status === 'available' && i.quantity > 0)
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, 4);

    grid.innerHTML = topPicks.map(createFoodCardHTML).join('');
    attachFoodCardListeners(grid);
  }

  function getFilteredListings() {
    const listings = Store.getListings();
    const filter = AppState.activeFilter;

    return listings.filter(item => {
      // Search text
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesRest = item.restaurantName.toLowerCase().includes(query);
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

      // Max price
      if (item.discountedPrice > filter.maxPrice) {
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

    modalContent.innerHTML = `
      <div class="food-modal-img-wrap">
        <img src="${item.image}" alt="${item.title}" class="food-modal-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
        <span class="food-badge-discount">${item.discountPercent}% OFF</span>
      </div>

      <div class="food-modal-inner">
        <div class="food-modal-rest-badge">
          <div>
            <strong style="color: var(--color-primary-dark); font-size: 1rem;">${item.restaurantName}</strong>
            <span style="color: var(--color-text-muted);"> • 📍 ${item.distance} km away</span>
          </div>
          <span class="food-badge-diet ${item.diet}">${item.diet === 'veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}</span>
        </div>

        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; line-height: 1.25;">${item.title}</h2>
        <span class="food-card-category-tag">${item.category}</span>

        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 1.25rem; line-height: 1.6;">
          ${item.description}
        </p>

        <div style="background: var(--color-surface-subtle); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1.25rem;">
          <div><strong>🌱 Fresh Ingredients:</strong> ${item.ingredients || 'Prepared fresh today with premium local ingredients.'}</div>
          <div style="margin-top: 0.35rem;"><strong>🛡️ Freshness Note:</strong> ${item.expiryNote || 'Best consumed within 24 hours of pickup.'}</div>
          <div style="margin-top: 0.35rem;"><strong>🕒 Safe Collection Window:</strong> Today, ${item.pickupStart} – ${item.pickupEnd}</div>
        </div>

        <div class="food-modal-qty-control">
          <div>
            <strong style="display: block; font-size: 0.9rem;">Select Bags to Rescue:</strong>
            <small style="color: var(--color-text-muted);">${item.quantity} portions available</small>
          </div>
          <div class="qty-counter-large">
            <button type="button" class="qty-btn-large" id="modal-qty-minus" ${AppState.checkoutQuantity <= 1 ? 'disabled' : ''}>-</button>
            <span class="qty-val-large" id="modal-qty-value">1</span>
            <button type="button" class="qty-btn-large" id="modal-qty-plus" ${AppState.checkoutQuantity >= item.quantity ? 'disabled' : ''}>+</button>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem;">
          <div>
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">Total Price:</span>
            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
              <span class="original-price" id="modal-total-orig">${formatCurrency(item.originalPrice)}</span>
              <span class="discounted-price" id="modal-total-disc">${formatCurrency(item.discountedPrice)}</span>
            </div>
          </div>
          <span class="badge-tag" id="modal-total-saved">You save ${formatCurrency(item.originalPrice - item.discountedPrice)}</span>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button type="button" class="btn btn-outline" style="flex: 1;" id="btn-modal-close-action">Back</button>
          <button type="button" class="btn btn-primary" style="flex: 2;" id="btn-modal-reserve-action" ${isSoldOut ? 'disabled' : ''}>
            ${isSoldOut ? 'Sold Out' : 'Proceed to Reserve'}
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
      totalDisc.textContent = formatCurrency(item.discountedPrice * q);
      totalSaved.textContent = `You save ${formatCurrency((item.originalPrice - item.discountedPrice) * q)}`;
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
  // 9. SIMULATED CHECKOUT & PICKUP CONFIRMATION FLOW
  // --------------------------------------------------------------------------
  function openCheckoutModal(item, quantity = 1) {
    // If not logged in, prompt user to log in or use 1-click customer demo
    if (!AppState.currentUser) {
      showToast('Please sign in or use 1-Click Demo to reserve food', 'info');
      openModal('modal-auth');
      return;
    }

    AppState.selectedFoodForCheckout = item;
    AppState.checkoutQuantity = quantity;
    AppState.selectedPaymentMethod = 'UPI';

    const modalBody = document.getElementById('checkout-modal-body');
    const originalTotal = item.originalPrice * quantity;
    const discountedTotal = item.discountedPrice * quantity;
    const savings = originalTotal - discountedTotal;

    modalBody.innerHTML = `
      <div class="checkout-item-summary">
        <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'">
        <div style="flex: 1;">
          <h4 style="font-size: 1.05rem; font-weight: 700;">${item.title}</h4>
          <span style="font-size: 0.85rem; color: var(--color-primary-dark); font-weight: 600;">${item.restaurantName}</span>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.25rem;">
            Quantity: <strong>${quantity} portion(s)</strong> • Pickup: <strong>${item.pickupStart} – ${item.pickupEnd}</strong>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Select Simulated Payment Option:</label>
        <div class="payment-options-grid">
          <label class="payment-option-card active" data-pay="UPI">
            <input type="radio" name="pay-method" value="UPI" checked>
            <div>
              <strong>📱 Instant UPI / QR</strong>
              <small style="display: block; color: var(--color-text-muted); font-size: 0.75rem;">Google Pay, PhonePe, Paytm</small>
            </div>
          </label>
          <label class="payment-option-card" data-pay="Card">
            <input type="radio" name="pay-method" value="Card">
            <div>
              <strong>💳 Card (Simulated)</strong>
              <small style="display: block; color: var(--color-text-muted); font-size: 0.75rem;">Visa, Mastercard, RuPay</small>
            </div>
          </label>
          <label class="payment-option-card" data-pay="Cash">
            <input type="radio" name="pay-method" value="Cash">
            <div>
              <strong>💵 Pay at Pickup Counter</strong>
              <small style="display: block; color: var(--color-text-muted); font-size: 0.75rem;">Cash or card at restaurant</small>
            </div>
          </label>
          <label class="payment-option-card" data-pay="Eco-Coins">
            <input type="radio" name="pay-method" value="Eco-Coins">
            <div>
              <strong>🌿 ZEWA Eco-Points</strong>
              <small style="display: block; color: var(--color-text-muted); font-size: 0.75rem;">Redeem 150 Green Points</small>
            </div>
          </label>
        </div>
      </div>

      <div class="bill-breakdown">
        <div class="bill-row">
          <span>Surplus Meals Subtotal:</span>
          <span>${formatCurrency(discountedTotal)}</span>
        </div>
        <div class="bill-row" style="color: var(--color-primary-dark); font-weight: 600;">
          <span>Zero-Waste Subsidy Savings:</span>
          <span>- ${formatCurrency(savings)}</span>
        </div>
        <div class="bill-row">
          <span>Eco-Friendly Biodegradable Packaging:</span>
          <span style="color: var(--color-veg); font-weight: 700;">FREE (Sponsored)</span>
        </div>
        <div class="bill-row total-row">
          <span>Total Payable Amount:</span>
          <span>${formatCurrency(discountedTotal)}</span>
        </div>
      </div>

      <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 1.5rem; text-align: center;">
        🔒 <em>Demo Model: No real financial transaction will occur. Confirmed booking will instantly generate an encrypted pickup code.</em>
      </p>

      <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-submit-booking">
        <span>Confirm Reservation & Generate Code</span>
        <svg class="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    `;

    openModal('modal-checkout');

    // Payment option selection toggles
    modalBody.querySelectorAll('.payment-option-card').forEach(card => {
      card.addEventListener('click', () => {
        modalBody.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        AppState.selectedPaymentMethod = card.getAttribute('data-pay');
      });
    });

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
    submitBtn.innerHTML = `<span>Securing Surplus Meal... ⏳</span>`;

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
      const pickupCode = generatePickupCode();
      const bookingId = generateBookingId();
      const unitPrice = item.discountedPrice;
      const totalPrice = unitPrice * qty;
      const moneySaved = (item.originalPrice - item.discountedPrice) * qty;
      const wasteSavedKg = Number((0.6 * qty).toFixed(1));

      const newOrder = {
        id: bookingId,
        pickupCode: pickupCode,
        foodId: item.id,
        foodTitle: item.title,
        foodImage: item.image,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        restaurantAddress: item.restaurantAddress || '12th Main, 100ft Road, Indiranagar',
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '+91 98765 43210',
        quantity: qty,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        moneySaved: moneySaved,
        wasteSavedKg: wasteSavedKg,
        paymentMethod: AppState.selectedPaymentMethod,
        pickupStart: item.pickupStart,
        pickupEnd: item.pickupEnd,
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

      // 4. Update customer personal metrics
      if (user.role === 'customer') {
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
  // 11. RESTAURANT DASHBOARD & PICKUP VERIFICATION TOOL
  // --------------------------------------------------------------------------
  function renderRestaurantDashboard() {
    const user = AppState.currentUser;
    if (!user || user.role !== 'restaurant') return;

    const restName = user.restaurantName || user.name;
    document.getElementById('restaurant-name-display').textContent = restName;
    document.getElementById('restaurant-profile-avatar').src = user.avatar;

    // Contact Form Populate
    document.getElementById('rest-prof-name').value = restName;
    document.getElementById('rest-prof-owner').value = user.owner || user.name;
    document.getElementById('rest-prof-phone').value = user.phone || '';
    document.getElementById('rest-prof-email').value = user.email;
    document.getElementById('rest-prof-address').value = user.address || '12th Main, 100ft Road, Indiranagar';
    document.getElementById('rest-prof-cuisine').value = user.cuisines || 'Continental, Bakery, Healthy';

    // Listings owned by this restaurant
    const allListings = Store.getListings();
    const myListings = allListings.filter(l => 
      l.restaurantId === user.restaurantId || l.restaurantName.toLowerCase() === restName.toLowerCase()
    );

    // Orders for this restaurant
    const allOrders = Store.getOrders();
    const myOrders = allOrders.filter(o => 
      o.restaurantId === user.restaurantId || o.restaurantName.toLowerCase() === restName.toLowerCase()
    );

    const pendingOrders = myOrders.filter(o => o.status === 'ready_for_pickup');
    const completedOrders = myOrders.filter(o => o.status === 'collected');

    // Revenue & Food saved metrics
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalFoodSavedKg = completedOrders.reduce((sum, o) => sum + (o.wasteSavedKg || 0), 0);

    document.getElementById('rest-stat-active-listings').textContent = myListings.filter(l => l.status === 'available').length;
    document.getElementById('rest-stat-pending-pickups').textContent = pendingOrders.length;
    document.getElementById('rest-stat-completed-pickups').textContent = completedOrders.length;
    document.getElementById('rest-stat-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('rest-stat-waste-saved').textContent = totalFoodSavedKg.toFixed(1) + ' kg';

    document.getElementById('rest-tab-orders-count').textContent = myOrders.length;
    document.getElementById('rest-tab-listings-count').textContent = myListings.length;

    // 1. Render Manage Listings Table
    const listingsWrap = document.getElementById('rest-listings-table-wrap');
    if (myListings.length === 0) {
      listingsWrap.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🍱</div>
          <h3>No food listings added yet</h3>
          <p>Publish your first unsold surplus meal or surprise bakery box.</p>
          <button type="button" class="btn btn-primary" id="btn-empty-add-listing">Add Surplus Food Listing</button>
        </div>
      `;
      document.getElementById('btn-empty-add-listing')?.addEventListener('click', () => {
        document.querySelector('[data-rest-tab="add-new-listing"]').click();
      });
    } else {
      listingsWrap.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Category</th>
              <th>Surplus Price</th>
              <th>Stock (Bags)</th>
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
                <td><span class="food-card-category-tag">${item.category}</span></td>
                <td>
                  <strong>${formatCurrency(item.discountedPrice)}</strong>
                  <small style="display: block; text-decoration: line-through; color: var(--color-text-light);">${formatCurrency(item.originalPrice)}</small>
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

      // Attach table actions
      attachListingTableListeners(listingsWrap);
    }

    // 2. Render Incoming Reservations Table
    const ordersWrap = document.getElementById('rest-orders-table-wrap');
    if (myOrders.length === 0) {
      ordersWrap.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">📋</div>
          <h3>No customer reservations yet</h3>
          <p>Incoming pickups with customer codes will appear here in real-time.</p>
        </div>
      `;
    } else {
      ordersWrap.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Reserved Food</th>
              <th>Qty</th>
              <th>Pickup Code</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${myOrders.map(order => `
              <tr data-order-id="${order.id}">
                <td><strong>${order.id}</strong></td>
                <td>
                  <strong>${order.customerName}</strong>
                  <span style="display: block; font-size: 0.75rem; color: var(--color-text-muted);">${order.customerPhone}</span>
                </td>
                <td>${order.foodTitle}</td>
                <td><strong>${order.quantity}</strong></td>
                <td>
                  <span style="font-family: monospace; font-weight: 800; background: var(--color-primary-light); color: var(--color-primary-darker); padding: 0.2rem 0.5rem; border-radius: var(--radius-xs); letter-spacing: 1px;">
                    ${order.pickupCode}
                  </span>
                </td>
                <td><strong>${formatCurrency(order.totalPrice)}</strong></td>
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
      feedbackEl.textContent = 'Please enter a valid 8-character pickup code.';
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
      feedbackEl.textContent = `❌ Reservation Cancelled: Order #${targetOrder.id} was cancelled by the customer.`;
      showToast(`Reservation cancelled`, 'error');
      return;
    }

    // Success! Mark order as collected
    targetOrder.status = 'collected';
    targetOrder.collectedAt = new Date().toISOString();
    Store.saveOrders(orders);

    feedbackEl.classList.add('feedback-success');
    feedbackEl.innerHTML = `
      🎉 <strong>Verification Successful!</strong> Hand over <strong>${targetOrder.quantity}x ${targetOrder.foodTitle}</strong> to <strong>${targetOrder.customerName}</strong>.
      Recovered Revenue: <strong>${formatCurrency(targetOrder.totalPrice)}</strong>.
    `;

    document.getElementById('verify-code-input').value = '';

    showToast(`Order #${targetOrder.id} verified & marked collected!`, 'success', 4000);

    // Refresh metrics & UI
    renderRestaurantDashboard();
    renderCustomerDashboard();
    renderGlobalImpactStats();
  }

  // --------------------------------------------------------------------------
  // 12. ADD NEW FOOD LISTING (RESTAURANT FEATURE)
  // --------------------------------------------------------------------------
  function setupAddListingForm() {
    const form = document.getElementById('form-add-food-listing');
    const origPriceInput = document.getElementById('new-food-original-price');
    const discPriceInput = document.getElementById('new-food-discounted-price');
    const discountDisplay = document.getElementById('auto-discount-display');
    const savingsDisplay = document.getElementById('auto-savings-display');
    const presetGrid = document.getElementById('food-image-preset-grid');
    const customImgInput = document.getElementById('new-food-custom-img');

    let selectedImg = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';

    // Image preset click
    presetGrid.querySelectorAll('.food-img-preset').forEach(preset => {
      preset.addEventListener('click', () => {
        presetGrid.querySelectorAll('.food-img-preset').forEach(p => p.classList.remove('active'));
        preset.classList.add('active');
        selectedImg = preset.getAttribute('data-img');
        customImgInput.value = '';
      });
    });

    customImgInput.addEventListener('input', () => {
      if (customImgInput.value.trim()) {
        presetGrid.querySelectorAll('.food-img-preset').forEach(p => p.classList.remove('active'));
        selectedImg = customImgInput.value.trim();
      }
    });

    // Auto-calculate discount percentage live!
    const calculateDiscount = () => {
      const orig = Number(origPriceInput.value) || 0;
      const disc = Number(discPriceInput.value) || 0;

      if (orig > 0 && disc > 0 && orig > disc) {
        const percent = Math.round(((orig - disc) / orig) * 100);
        discountDisplay.textContent = `${percent}% OFF`;
        savingsDisplay.textContent = `(You will save customer ${formatCurrency(orig - disc)})`;
      } else {
        discountDisplay.textContent = '0% OFF';
        savingsDisplay.textContent = '(Surplus price must be lower than original price)';
      }
    };

    origPriceInput.addEventListener('input', calculateDiscount);
    discPriceInput.addEventListener('input', calculateDiscount);

    // Submit form
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const user = AppState.currentUser;
      if (!user || user.role !== 'restaurant') {
        showToast('Only restaurant accounts can publish food listings.', 'error');
        return;
      }

      const origPrice = Number(origPriceInput.value);
      const discPrice = Number(discPriceInput.value);

      if (discPrice >= origPrice) {
        showToast('Surplus price must be lower than the original menu price.', 'error');
        return;
      }

      const discountPercent = Math.round(((origPrice - discPrice) / origPrice) * 100);

      const newListing = {
        id: 'food-' + Date.now(),
        title: document.getElementById('new-food-name').value.trim(),
        restaurantId: user.restaurantId || 'rest-1',
        restaurantName: user.restaurantName || user.name,
        category: document.getElementById('new-food-category').value,
        diet: document.getElementById('new-food-diet').value,
        originalPrice: origPrice,
        discountedPrice: discPrice,
        discountPercent: discountPercent,
        quantity: Number(document.getElementById('new-food-quantity').value),
        pickupStart: document.getElementById('new-food-pickup-start').value,
        pickupEnd: document.getElementById('new-food-pickup-end').value,
        distance: 1.1,
        status: 'available',
        image: selectedImg,
        description: document.getElementById('new-food-description').value.trim(),
        ingredients: 'Prepared in licensed kitchen today with high quality standard procedures.',
        expiryNote: 'Safe to consume within 24-48 hours.'
      };

      const listings = Store.getListings();
      listings.unshift(newListing);
      Store.saveListings(listings);

      form.reset();
      calculateDiscount();

      showToast(`"${newListing.title}" published to marketplace with ${discountPercent}% discount!`, 'success');

      // Switch to Manage Listings tab
      document.querySelector('[data-rest-tab="manage-listings"]').click();
      renderRestaurantDashboard();
      renderMarketplace();
      renderFeaturedFood();
    });
  }

  // --------------------------------------------------------------------------
  // 13. INTERACTIVE VISUAL MAP SIMULATION
  // --------------------------------------------------------------------------
  function renderMapPins() {
    const overlay = document.getElementById('map-pins-overlay');
    if (!overlay) return;

    const listings = Store.getListings();

    overlay.innerHTML = DEFAULT_RESTAURANTS.map((rest, index) => {
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
    const rest = DEFAULT_RESTAURANTS.find(r => r.id === restId);
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
      handleLogin('customer@zewa.demo', 'pass123');
    });

    document.getElementById('btn-quick-restaurant')?.addEventListener('click', () => {
      handleLogin('greenbistro@zewa.demo', 'pass123');
    });

    document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => {
      confirmAction('Reset Demo Data', 'This will restore all sample food listings, orders, and demo accounts to their initial state.', () => {
        Store.init(true);
        AppState.currentUser = null;
        updateAuthUI();
        showToast('Demo data successfully restored to initial state!', 'success');
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

    // Mobile Hamburger Menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-navigation');
    mobileMenuToggle?.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
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

    // Hero Section CTAs
    document.getElementById('hero-btn-explore')?.addEventListener('click', () => {
      window.location.hash = 'marketplace';
    });

    document.getElementById('hero-btn-partner')?.addEventListener('click', () => {
      if (AppState.currentUser && AppState.currentUser.role === 'restaurant') {
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

    // Benefits Section CTAs
    document.getElementById('btn-benefit-customer-cta')?.addEventListener('click', () => {
      window.location.hash = 'marketplace';
    });

    document.getElementById('btn-benefit-partner-cta')?.addEventListener('click', () => {
      openModal('modal-auth');
      document.getElementById('tab-register-btn').click();
      document.getElementById('role-label-restaurant').click();
    });

    // How It Works Tabs (Customer vs Restaurant)
    document.querySelectorAll('.how-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.how-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const flow = btn.getAttribute('data-flow');
        if (flow === 'customer') {
          document.getElementById('flow-customer').classList.remove('hidden');
          document.getElementById('flow-restaurant').classList.add('hidden');
        } else {
          document.getElementById('flow-customer').classList.add('hidden');
          document.getElementById('flow-restaurant').classList.remove('hidden');
        }
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
      handleLogin('customer@zewa.demo', 'pass123');
    });

    document.getElementById('demo-auth-restaurant')?.addEventListener('click', () => {
      handleLogin('greenbistro@zewa.demo', 'pass123');
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
    const regAddressGroup = document.getElementById('reg-restaurant-address-group');
    const regNameLabel = document.getElementById('reg-name-label');

    roleCust?.addEventListener('click', () => {
      roleCust.classList.add('active');
      roleRest.classList.remove('active');
      regAddressGroup.classList.add('hidden');
      regNameLabel.textContent = 'Full Name *';
      document.getElementById('login-email').placeholder = 'e.g. customer@zewa.demo';
    });

    roleRest?.addEventListener('click', () => {
      roleRest.classList.add('active');
      roleCust.classList.remove('active');
      regAddressGroup.classList.remove('hidden');
      regNameLabel.textContent = 'Restaurant / Business Name *';
      document.getElementById('login-email').placeholder = 'e.g. greenbistro@zewa.demo';
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
        address: document.getElementById('reg-address').value.trim()
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

    document.getElementById('dropdown-btn-edit-profile')?.addEventListener('click', () => {
      if (AppState.currentUser?.role === 'restaurant') {
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
      handleLogin('customer@zewa.demo', 'pass123');
    });

    document.getElementById('footer-btn-demo-rest')?.addEventListener('click', () => {
      handleLogin('greenbistro@zewa.demo', 'pass123');
    });

    document.getElementById('footer-btn-reset')?.addEventListener('click', () => {
      document.getElementById('btn-reset-demo-data')?.click();
    });

    // Marketplace Search & Filters
    const searchInput = document.getElementById('marketplace-search-input');
    const clearSearchBtn = document.getElementById('btn-clear-search');

    searchInput?.addEventListener('input', (e) => {
      AppState.activeFilter.search = e.target.value;
      clearSearchBtn.classList.toggle('hidden', !e.target.value);
      renderMarketplace();
    });

    clearSearchBtn?.addEventListener('click', () => {
      searchInput.value = '';
      AppState.activeFilter.search = '';
      clearSearchBtn.classList.add('hidden');
      renderMarketplace();
    });

    document.getElementById('sort-by-select')?.addEventListener('change', (e) => {
      AppState.activeFilter.sortBy = e.target.value;
      renderMarketplace();
    });

    // Category pills
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        AppState.activeFilter.category = pill.getAttribute('data-category');
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
      priceLabel.textContent = formatCurrency(e.target.value);
      renderMarketplace();
    });

    // Distance slider
    const distSlider = document.getElementById('distance-range-slider');
    const distLabel = document.getElementById('distance-slider-label');
    distSlider?.addEventListener('input', (e) => {
      AppState.activeFilter.maxDistance = Number(e.target.value);
      distLabel.textContent = `${e.target.value} km`;
      renderMarketplace();
    });

    // Reset filters
    const resetFiltersHandler = () => {
      AppState.activeFilter = {
        search: '',
        category: 'all',
        diet: 'all',
        maxPrice: 600,
        maxDistance: 15,
        sortBy: 'discount-desc'
      };
      if (searchInput) searchInput.value = '';
      clearSearchBtn?.classList.add('hidden');
      document.querySelectorAll('.category-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      document.querySelectorAll('.dietary-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-diet') === 'all'));
      if (priceSlider) { priceSlider.value = 600; priceLabel.textContent = '₹600'; }
      if (distSlider) { distSlider.value = 15; distLabel.textContent = '15 km'; }
      document.getElementById('sort-by-select').value = 'discount-desc';
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
      if (!user || user.role !== 'restaurant') return;

      const restName = document.getElementById('rest-prof-name').value.trim();
      user.restaurantName = restName;
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
      showToast('Restaurant details updated successfully!', 'success');
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
