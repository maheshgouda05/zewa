/**
 * ZEWA - Restaurant & Food Cart Platform Controller
 * Handles surplus food listing with dynamic pricing curve simulator,
 * live inventory management, and incoming paid order fulfillment.
 */

window.zewaRestaurant = {
  restaurantData: null,
  activeTab: 'inventory', // 'inventory' | 'orders' | 'add'

  async init() {
    await this.loadDashboard();
    this.bindEvents();
    this.initPricingSimulator();
  },

  async loadDashboard() {
    try {
      const res = await window.zewaApi.getRestaurantDashboard();
      this.restaurantData = res;
      this.renderDashboardStats(res);
      this.renderInventory(res.items || []);
      this.renderOrders(res.orders || []);
    } catch (err) {
      console.error('[Restaurant] Dashboard error:', err);
      window.zewaApp.showToast(`Restaurant data error: ${err.message}`, 'error');
    }
  },

  bindEvents() {
    // Add Food Form
    const formAdd = document.getElementById('form-add-food');
    if (formAdd) {
      formAdd.addEventListener('submit', (e) => this.handleAddFoodSubmit(e));
    }

    // Modal Add Food triggers
    const btnOpenAdd = document.getElementById('btn-open-add-food');
    if (btnOpenAdd) {
      btnOpenAdd.addEventListener('click', () => {
        const modal = document.getElementById('modal-add-food');
        if (modal) modal.classList.add('is-open');
      });
    }

    const btnCloseAdd = document.getElementById('btn-close-add-food');
    if (btnCloseAdd) {
      btnCloseAdd.addEventListener('click', () => {
        const modal = document.getElementById('modal-add-food');
        if (modal) modal.classList.remove('is-open');
      });
    }
  },

  renderDashboardStats(data) {
    const rName = document.getElementById('rest-name');
    const rAddress = document.getElementById('rest-address');
    if (rName && data.restaurant) rName.textContent = data.restaurant.name;
    if (rAddress && data.restaurant) rAddress.textContent = `📍 ${data.restaurant.address}`;

    const stats = data.stats || {};
    const elActive = document.getElementById('rest-stat-active-items');
    const elRescued = document.getElementById('rest-stat-portions-rescued');
    const elWaste = document.getElementById('rest-stat-waste-prevented');
    const elRevenue = document.getElementById('rest-stat-revenue');

    if (elActive) elActive.textContent = stats.active_items || 0;
    if (elRescued) elRescued.textContent = stats.portions_rescued || 0;
    if (elWaste) elWaste.textContent = `${stats.waste_prevented_kg || 0} kg`;
    if (elRevenue) elRevenue.textContent = `₹${stats.total_revenue || 0}`;
  },

  renderInventory(items) {
    const container = document.getElementById('rest-inventory-list');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🍲</div>
          <h3>No surplus food listed yet</h3>
          <p>List unsold meals or baked goods before closing to prevent food waste.</p>
          <button class="btn btn-primary btn-sm mt-3" onclick="document.getElementById('modal-add-food').classList.add('is-open')">
            + List Surplus Food
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => {
      const pricing = item.pricing || {};
      return `
        <div class="inventory-card">
          <img src="${item.image_url}" alt="${item.name}" class="inventory-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
          <div class="inventory-info">
            <div class="inventory-header">
              <span class="badge ${item.is_veg ? 'badge-veg' : 'badge-nonveg'}">
                <span class="dot"></span> ${item.is_veg ? 'Veg' : 'Non-Veg'}
              </span>
              <span class="badge badge-discount">${pricing.discount_percentage || 50}% OFF</span>
            </div>
            <h4>${item.name}</h4>
            <p class="text-sm text-muted">${item.category} • Original ₹${item.original_price}</p>
            <div class="inventory-prices">
              <span>Current Dynamic Price: <strong>₹${pricing.current_price || item.starting_price}</strong></span>
              <span>Floor: <strong>₹${item.min_price}</strong></span>
            </div>
          </div>
          <div class="inventory-actions">
            <div class="stock-badge">
              <strong>${item.available_quantity}</strong>
              <span>portions left</span>
            </div>
            <button class="btn btn-outline btn-sm btn-danger" onclick="window.zewaRestaurant.deleteItem('${item.id}')">
              Remove
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderOrders(orders) {
    const container = document.getElementById('rest-orders-list');
    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔔</div>
          <h3>No pending orders</h3>
          <p>Customer orders will appear here in real-time once prepaid verification is complete.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      const isPaid = order.status === 'paid';
      const isPreparing = order.status === 'preparing';

      return `
        <div class="order-kitchen-card">
          <div class="kitchen-order-header">
            <div>
              <span class="order-id">${order.order_number}</span>
              <span class="order-time">${new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <span class="status-badge status-${order.status}">${order.status.replace(/_/g, ' ')}</span>
          </div>

          <div class="kitchen-order-items">
            ${order.items ? order.items.map(i => `
              <div class="kitchen-item-row">
                <strong>${i.food_item ? i.food_item.name : 'Surplus Item'}</strong>
                <span class="qty-badge">${i.quantity} portion</span>
              </div>
            `).join('') : ''}
          </div>

          <div class="kitchen-customer-info">
            <p>Customer: <strong>${order.customer ? order.customer.full_name : 'Valued Customer'}</strong></p>
            <p class="text-sm text-muted">Delivery Address: ${order.delivery_address || 'Indiranagar'}</p>
          </div>

          <div class="kitchen-actions">
            ${isPaid ? `
              <button class="btn btn-primary btn-sm btn-block" onclick="window.zewaRestaurant.updateStatus('${order.id}', 'preparing')">
                👨‍🍳 Start Packing Food
              </button>
            ` : isPreparing ? `
              <button class="btn btn-accent btn-sm btn-block" onclick="window.zewaRestaurant.updateStatus('${order.id}', 'ready_for_pickup')">
                ✅ Mark Ready for Eco-Delivery Pickup
              </button>
            ` : `
              <div class="kitchen-completed-note">
                <span>Handed to Delivery Partner: <strong>${order.delivery_partner ? order.delivery_partner.full_name : 'Assigned Partner'}</strong></span>
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  async handleAddFoodSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Listing Surplus Food...';

      const payload = {
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        category: form.category.value,
        is_veg: form.is_veg.value === 'true',
        original_price: parseFloat(form.original_price.value),
        starting_price: parseFloat(form.starting_price.value),
        min_price: parseFloat(form.min_price.value),
        available_quantity: parseInt(form.available_quantity.value, 10),
        freshness_notes: form.freshness_notes.value.trim() || 'Freshly prepared surplus portion',
        image_url: form.image_url.value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
        closing_time: form.closing_time.value
      };

      await window.zewaApi.addFoodItem(payload);
      window.zewaApp.showToast('Surplus Food listed successfully!', 'success');

      form.reset();
      const modal = document.getElementById('modal-add-food');
      if (modal) modal.classList.remove('is-open');

      await this.loadDashboard();
      // Also reload customer feed if active
      if (window.zewaCustomer) window.zewaCustomer.loadFeed();
    } catch (err) {
      window.zewaApp.showToast(err.message || 'Failed to list food.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Publish Listing';
    }
  },

  async updateStatus(orderId, status) {
    try {
      await window.zewaApi.updateOrderStatus(orderId, status);
      window.zewaApp.showToast(`Order updated to: ${status.replace(/_/g, ' ')}`, 'success');
      await this.loadDashboard();
    } catch (err) {
      window.zewaApp.showToast(err.message, 'error');
    }
  },

  async deleteItem(id) {
    if (!confirm('Remove this food listing from the Zero Waste surplus feed?')) return;
    try {
      await window.zewaApi.deleteFoodItem(id);
      window.zewaApp.showToast('Listing removed.', 'info');
      await this.loadDashboard();
      if (window.zewaCustomer) window.zewaCustomer.loadFeed();
    } catch (err) {
      window.zewaApp.showToast(err.message, 'error');
    }
  },

  /**
   * Interactive Simulator inside Add Food Modal showing real-time price decay curve
   */
  initPricingSimulator() {
    const origInput = document.getElementById('form-orig-price');
    const startInput = document.getElementById('form-start-price');
    const minInput = document.getElementById('form-min-price');
    const previewEl = document.getElementById('pricing-decay-preview');

    const updatePreview = () => {
      if (!origInput || !startInput || !minInput || !previewEl) return;

      const orig = parseFloat(origInput.value) || 200;
      const start = parseFloat(startInput.value) || Math.round(orig * 0.7);
      const min = parseFloat(minInput.value) || Math.round(orig * 0.35);

      const midPrice = Math.round(start - ((start - min) * Math.pow(0.5, 1.35)));

      previewEl.innerHTML = `
        <div class="decay-step">
          <span class="step-label">Open Listing</span>
          <strong>₹${start}</strong>
          <small>${Math.round((1 - start/orig)*100)}% off</small>
        </div>
        <div class="decay-arrow">➔</div>
        <div class="decay-step">
          <span class="step-label">Mid-Window</span>
          <strong>₹${midPrice}</strong>
          <small>${Math.round((1 - midPrice/orig)*100)}% off</small>
        </div>
        <div class="decay-arrow">➔</div>
        <div class="decay-step urgent">
          <span class="step-label">Closing Push</span>
          <strong>₹${min}</strong>
          <small>${Math.round((1 - min/orig)*100)}% off</small>
        </div>
      `;
    };

    if (origInput && startInput && minInput) {
      [origInput, startInput, minInput].forEach(inp => inp.addEventListener('input', updatePreview));
      updatePreview();
    }
  }
};
