/**
 * ZEWA - Customer Marketplace & Dynamic Pricing Engine
 * Features live 1-second dynamic price recalculation, countdown timers,
 * category & dietary filters, and strict max 2-unit purchase limits.
 */

window.zewaCustomer = {
  feedItems: [],
  filteredItems: [],
  selectedCategory: 'all',
  dietFilter: 'all', // all | veg | nonveg
  searchQuery: '',
  maxDistanceKm: 15,
  timerInterval: null,
  cart: {}, // { [foodId]: { item, quantity } }

  async init() {
    await this.loadFeed();
    this.bindEvents();
    this.startLivePricingEngine();
  },

  async loadFeed() {
    try {
      const loc = window.zewaMaps.getCurrentLocation();
      const params = {
        lat: loc.lat,
        lng: loc.lng,
        category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined,
        diet: this.dietFilter !== 'all' ? this.dietFilter : undefined,
        search: this.searchQuery || undefined,
        maxDistance: this.maxDistanceKm
      };

      const res = await window.zewaApi.getFeed(params);
      this.feedItems = res.items || [];
      this.renderFeed();
      this.updateFeedStats(res.count || 0);
    } catch (err) {
      console.error('[Customer] Error loading feed:', err);
      const container = document.getElementById('food-feed-grid');
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h3>Unable to load surplus food</h3>
            <p>${err.message}</p>
            <button class="btn btn-primary btn-sm mt-3" onclick="window.zewaCustomer.loadFeed()">Try Again</button>
          </div>
        `;
      }
    }
  },

  bindEvents() {
    // Category pill clicks
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedCategory = e.currentTarget.getAttribute('data-category');
        this.loadFeed();
      });
    });

    // Diet filter (Veg / All)
    const vegCheckbox = document.getElementById('filter-pure-veg');
    if (vegCheckbox) {
      vegCheckbox.addEventListener('change', (e) => {
        this.dietFilter = e.target.checked ? 'veg' : 'all';
        this.loadFeed();
      });
    }

    // Search bar
    const searchInput = document.getElementById('search-food');
    if (searchInput) {
      let debounceTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          this.searchQuery = e.target.value.trim();
          this.loadFeed();
        }, 300);
      });
    }

    // Distance Slider (if present)
    const distInput = document.getElementById('filter-max-distance');
    if (distInput) {
      distInput.addEventListener('change', (e) => {
        this.maxDistanceKm = parseFloat(e.target.value);
        this.loadFeed();
      });
    }
  },

  renderFeed() {
    const container = document.getElementById('food-feed-grid');
    if (!container) return;

    if (!this.feedItems || this.feedItems.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🌱</div>
          <h3>No surplus food available nearby</h3>
          <p>Local restaurants haven't listed closing surplus yet, or items are sold out. Check back as closing hours approach!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.feedItems.map(item => this.createFoodCardHtml(item)).join('');
  },

  createFoodCardHtml(item) {
    const pricing = item.pricing || {};
    const restaurant = item.restaurant || {};
    const distFormatted = window.zewaMaps.formatDistance(item.distance_km || 1.2);
    const cartQty = this.cart[item.id] ? this.cart[item.id].quantity : 0;

    return `
      <article class="food-card" data-food-id="${item.id}" data-closing="${pricing.closing_time}">
        <div class="card-media">
          <img src="${item.image_url}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'">
          <div class="card-badges">
            <span class="badge ${item.is_veg ? 'badge-veg' : 'badge-nonveg'}">
              <span class="dot"></span> ${item.is_veg ? 'Pure Veg' : 'Non-Veg'}
            </span>
            <span class="badge badge-discount" id="badge-discount-${item.id}">
              ${pricing.discount_percentage || 50}% OFF
            </span>
          </div>
          <div class="urgency-bar">
            <span>⏳ Closing: <strong id="timer-${item.id}">${pricing.time_remaining_formatted || '00:00:00'}</strong></span>
          </div>
        </div>

        <div class="card-body">
          <div class="seller-meta">
            <span class="seller-name">${restaurant.name || 'Local Kitchen'}</span>
            <span class="distance-tag">📍 ${distFormatted}</span>
          </div>

          <h3 class="food-title">${item.name}</h3>
          <p class="food-description">${item.description || 'Freshly prepared surplus portion.'}</p>

          <div class="freshness-note">
            <span>✨ Packed fresh: ${item.freshness_notes || 'Today, pristine quality'}</span>
          </div>

          <div class="pricing-row">
            <div class="price-stack">
              <div class="price-current-wrap">
                <span class="price-currency">₹</span>
                <span class="price-current" id="price-${item.id}">${pricing.current_price}</span>
              </div>
              <span class="price-original">₹${item.original_price}</span>
            </div>
            <div class="units-left">
              <span class="units-pill ${item.available_quantity <= 3 ? 'urgent' : ''}">
                ${item.available_quantity} portions left
              </span>
            </div>
          </div>

          <div class="card-actions">
            <div class="quantity-control" id="qty-control-${item.id}">
              ${cartQty > 0 ? `
                <button class="btn-qty" onclick="window.zewaCustomer.updateQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                <span class="qty-display">${cartQty}</span>
                <button class="btn-qty" onclick="window.zewaCustomer.updateQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
              ` : `
                <button class="btn btn-primary btn-sm btn-block" onclick="window.zewaCustomer.addToCart('${item.id}')">
                  Reserve &amp; Order
                </button>
              `}
            </div>
            <div class="purchase-limit-hint">
              <span>Fair Share Limit: Max 2 units / customer</span>
            </div>
          </div>
        </div>
      </article>
    `;
  },

  updateQuantity(foodId, delta) {
    const item = this.feedItems.find(f => f.id === foodId);
    if (!item) return;

    const currentQty = this.cart[foodId] ? this.cart[foodId].quantity : 0;
    const newQty = currentQty + delta;

    if (newQty > 2) {
      window.zewaApp.showToast('Zero Waste Fair Share Rule: Maximum 2 units per customer per listing to prevent hoarding.', 'warning');
      return;
    }

    if (newQty <= 0) {
      delete this.cart[foodId];
    } else {
      this.cart[foodId] = {
        item,
        quantity: newQty
      };
    }

    this.updateCardQuantityUi(foodId);
    this.updateFloatingCartBar();

    // If added to cart, immediately trigger quick reservation prompt
    if (newQty > 0 && delta > 0) {
      window.zewaOrders.initiateReservation(item, newQty);
    }
  },

  addToCart(foodId) {
    this.updateQuantity(foodId, 1);
  },

  updateCardQuantityUi(foodId) {
    const control = document.getElementById(`qty-control-${foodId}`);
    if (!control) return;

    const qty = this.cart[foodId] ? this.cart[foodId].quantity : 0;
    if (qty > 0) {
      control.innerHTML = `
        <button class="btn-qty" onclick="window.zewaCustomer.updateQuantity('${foodId}', -1)" aria-label="Decrease quantity">−</button>
        <span class="qty-display">${qty}</span>
        <button class="btn-qty" onclick="window.zewaCustomer.updateQuantity('${foodId}', 1)" aria-label="Increase quantity">+</button>
      `;
    } else {
      control.innerHTML = `
        <button class="btn btn-primary btn-sm btn-block" onclick="window.zewaCustomer.addToCart('${foodId}')">
          Reserve &amp; Order
        </button>
      `;
    }
  },

  updateFloatingCartBar() {
    const bar = document.getElementById('floating-cart-bar');
    if (!bar) return;

    const totalItems = Object.values(this.cart).reduce((sum, entry) => sum + entry.quantity, 0);
    const totalPrice = Object.values(this.cart).reduce((sum, entry) => {
      const price = entry.item.pricing ? entry.item.pricing.current_price : entry.item.starting_price;
      return sum + (price * entry.quantity);
    }, 0);

    if (totalItems > 0) {
      bar.classList.add('visible');
      bar.innerHTML = `
        <div class="cart-summary">
          <span class="cart-count">${totalItems} item${totalItems > 1 ? 's' : ''} reserved</span>
          <span class="cart-total">₹${totalPrice}</span>
        </div>
        <button class="btn btn-accent btn-sm" onclick="window.zewaOrders.openCheckoutFromCart()">
          Complete Order →
        </button>
      `;
    } else {
      bar.classList.remove('visible');
    }
  },

  updateFeedStats(count) {
    const el = document.getElementById('stat-available-count');
    if (el) el.textContent = `${count} Surplus Portions Near You`;
  },

  /**
   * Live Dynamic Pricing Engine running every 1 second
   * Re-evaluates discount curves and countdown timers smoothly without re-rendering.
   */
  startLivePricingEngine() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const now = new Date();

      this.feedItems.forEach(item => {
        if (!item.pricing || !item.pricing.closing_time) return;

        const closingTime = new Date(item.pricing.closing_time);
        const diffMs = closingTime - now;

        const timerEl = document.getElementById(`timer-${item.id}`);
        const priceEl = document.getElementById(`price-${item.id}`);
        const badgeEl = document.getElementById(`badge-discount-${item.id}`);

        if (diffMs <= 0) {
          if (timerEl) timerEl.textContent = 'CLOSED';
          if (badgeEl) badgeEl.textContent = 'SOLD OUT / CLOSED';
          return;
        }

        // Format remaining time
        const totalSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        const formatted = `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (timerEl) timerEl.textContent = formatted;

        // Dynamic pricing calculation
        const windowDurationMs = (item.pricing.window_hours || 4) * 3600 * 1000;
        const timeRatio = Math.max(0, Math.min(1, diffMs / windowDurationMs));
        const decayMultiplier = Math.pow(1 - timeRatio, 1.35);

        const startingPrice = item.starting_price || item.original_price * 0.7;
        const minPrice = item.min_price || item.original_price * 0.3;
        const currentPrice = Math.round(startingPrice - ((startingPrice - minPrice) * decayMultiplier));
        const discountPct = Math.round(((item.original_price - currentPrice) / item.original_price) * 100);

        if (priceEl && priceEl.textContent !== String(currentPrice)) {
          priceEl.textContent = currentPrice;
        }

        if (badgeEl && badgeEl.textContent !== `${discountPct}% OFF`) {
          badgeEl.textContent = `${discountPct}% OFF`;
        }

        // Update item pricing reference
        item.pricing.current_price = currentPrice;
        item.pricing.discount_percentage = discountPct;
      });
    }, 1000);
  }
};
